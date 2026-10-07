"use client";

import { useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { formatTime, useRecorder, type RecordingResult } from "@/hooks/useRecorder";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF8F5]";

export default function Recorder({
                                     onComplete,
                                     maxSeconds = 300,
                                 }: {
    onComplete: (result: RecordingResult) => void;
    maxSeconds?: number;
}) {
    const r = useRecorder({ onComplete, maxSeconds });
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) videoRef.current.srcObject = r.stream;
    }, [r.stream]);

    const live = r.status === "ready" || r.status === "countdown" || r.status === "recording";

    return (
        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[28px] bg-[#14213D] p-6 text-center">
            {/* Live preview (mirrored, like a mirror) */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${live ? "" : "invisible"}`}
            />

            {/* Before the camera is on */}
            {!live && (
                <div className="relative flex max-w-md flex-col items-center gap-5">
                    <h2 className={`${display} text-[clamp(26px,4.5vw,44px)] font-extrabold leading-[1.02] text-[#FAF8F5]`}>
                        {r.status === "error" ? "We can't reach your camera" : "Ready to practice?"}
                    </h2>
                    <p className="text-sm leading-normal text-[#C9C3B8]">
                        {r.error ?? "Your video stays on this device until you choose to save it."}
                    </p>
                    <button
                        onClick={r.openCamera}
                        disabled={r.status === "requesting"}
                        className={`inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#14213D] hover:bg-white disabled:opacity-60 ${focus}`}
                    >
                        <Camera size={16} />
                        {r.status === "requesting" ? "Waiting for permission..." : r.status === "error" ? "Try again" : "Turn on camera"}
                    </button>
                </div>
            )}

            {/* Countdown */}
            {r.status === "countdown" && (
                <div className="absolute inset-0 grid place-items-center bg-[#14213D]/55" aria-live="assertive">
          <span className={`${display} text-[clamp(96px,20vw,200px)] font-extrabold leading-none text-[#FAF8F5]`}>
            {r.count}
          </span>
                    <button
                        onClick={r.cancelCountdown}
                        className={`absolute bottom-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#FAF8F5] ${focus}`}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Timer */}
            {r.status === "recording" && (
                <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-[#14213D]/70 px-3 py-1.5 font-mono text-xs font-semibold text-[#FAF8F5]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#FF7A59] motion-reduce:animate-none" />
                    {formatTime(r.elapsed)} / {formatTime(r.maxSeconds)}
        </span>
            )}

            {/* Record / stop */}
            {(r.status === "ready" || r.status === "recording") && (
                <div className="absolute bottom-5 flex flex-col items-center gap-2">
                    <button
                        onClick={r.status === "ready" ? r.start : r.stop}
                        aria-label={r.status === "ready" ? "Start recording" : "Stop recording"}
                        className={`grid h-16 w-16 place-items-center rounded-full bg-[#FAF8F5] ring-4 ring-[#FAF8F5]/30 hover:scale-105 motion-reduce:hover:scale-100 ${focus}`}
                    >
                        {r.status === "ready" ? (
                            <span className="h-7 w-7 rounded-full bg-[#FF7A59]" />
                        ) : (
                            <span className="h-6 w-6 rounded-md bg-[#FF7A59]" />
                        )}
                    </button>
                    {r.status === "ready" && (
                        <span className="text-xs text-[#FAF8F5]/80">Starts after a 3 second countdown</span>
                    )}
                </div>
            )}
        </div>
    );
}