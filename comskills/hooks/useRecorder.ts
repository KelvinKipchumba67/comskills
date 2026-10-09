"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecordingResult = { blob: Blob; url: string; seconds: number; mimeType: string };
export type RecorderStatus = "idle" | "requesting" | "ready" | "countdown" | "recording" | "error";

//Picks the first one the browser supports.
const MIME_TYPES = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];

function pickMimeType() {
    if (typeof MediaRecorder === "undefined") return "";
    return MIME_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function explain(err: unknown) {
    const name = err instanceof DOMException ? err.name : "";
    if (name === "NotAllowedError")
        return "Camera and microphone access is blocked. Allow access in your browser's address bar, then try again.";
    if (name === "NotFoundError") return "No camera or microphone found. Connect one and try again.";
    if (name === "NotReadableError")
        return "Another app is using your camera or microphone. Close it and try again.";
    if (err instanceof Error && err.message === "unsupported")
        return "This browser can't record video. Try the latest Chrome, Edge, Firefox or Safari.";
    return "Couldn't start the camera. Check your browser permissions and try again.";
}

export const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

type Options = {
    countdownFrom?: number;
    maxSeconds?: number;
    onComplete: (result: RecordingResult) => void;
};

export function useRecorder({ countdownFrom = 3, maxSeconds = 300, onComplete }: Options) {
    const [status, setStatus] = useState<RecorderStatus>("idle");
    const [error, setError] = useState<string | null>(null);
    const [count, setCount] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const startedAtRef = useRef(0);
    const countdownRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    });

    const clearTimers = useCallback(() => {
        if (countdownRef.current) window.clearInterval(countdownRef.current);
        if (timerRef.current) window.clearInterval(timerRef.current);
        countdownRef.current = null;
        timerRef.current = null;
    }, []);

    const stopStream = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStream(null);
    }, []);

    const openCamera = useCallback(async () => {
        setError(null);
        setStatus("requesting");
        try {
            if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
                throw new Error("unsupported");
            }
            const s = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: { echoCancellation: true, noiseSuppression: true },
            });
            streamRef.current = s;
            setStream(s);
            setStatus("ready");
        } catch (err) {
            setError(explain(err));
            setStatus("error");
        }
    }, []);

    const beginRecording = useCallback(() => {
        const s = streamRef.current;
        if (!s) return;

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(s, {
            ...(mimeType ? { mimeType } : {}),
            // Capped so a 5-minute take stays around 40 MB.
            videoBitsPerSecond: 1_000_000,
            audioBitsPerSecond: 96_000,
        });

        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
            const type = recorder.mimeType || mimeType || "video/webm";
            const blob = new Blob(chunksRef.current, { type });
            const seconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
            clearTimers();
            stopStream();
            onCompleteRef.current({ blob, url: URL.createObjectURL(blob), seconds, mimeType: type });
        };

        recorderRef.current = recorder;
        startedAtRef.current = Date.now();
        recorder.start(1000);
        setElapsed(0);
        setStatus("recording");

        timerRef.current = window.setInterval(() => {
            const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
            setElapsed(secs);
            if (secs >= maxSeconds && recorder.state === "recording") recorder.stop();
        }, 250);
    }, [clearTimers, stopStream, maxSeconds]);

    const start = useCallback(() => {
        if (!streamRef.current) return;
        let n = countdownFrom;
        setCount(n);
        setStatus("countdown");
        countdownRef.current = window.setInterval(() => {
            n -= 1;
            if (n <= 0) {
                if (countdownRef.current) window.clearInterval(countdownRef.current);
                countdownRef.current = null;
                beginRecording();
            } else {
                setCount(n);
            }
        }, 1000);
    }, [countdownFrom, beginRecording]);

    const cancelCountdown = useCallback(() => {
        clearTimers();
        setStatus("ready");
    }, [clearTimers]);

    const stop = useCallback(() => {
        if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    }, []);

    // Leaving the page mid-recording releases the camera and throws the take away.
    useEffect(() => {
        return () => {
            clearTimers();
            const r = recorderRef.current;
            if (r) {
                r.onstop = null;
                if (r.state !== "inactive") r.stop();
            }
            streamRef.current?.getTracks().forEach((t) => t.stop());
        };
    }, [clearTimers]);

    return { status, error, count, elapsed, stream, maxSeconds, openCamera, start, stop, cancelCountdown };
}