"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Play } from "lucide-react";
import { formatDuration } from "@/lib/format";
import type { AnalysisResult, Moment } from "@/lib/analysis/types";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const eyebrow = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A5568]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const btn =
    "inline-flex h-[52px] items-center gap-2.5 rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] disabled:opacity-60";
const smallBtn =
    "inline-flex items-center rounded-full bg-[#14213D] px-5 py-2 text-xs font-bold text-white hover:bg-[#1d2f55] disabled:opacity-60";

const STUCK_MS = 190_000; // a run that has been going this long has almost certainly stopped

type Status = "NONE" | "PROCESSING" | "DONE" | "FAILED";

type Props = {
    id: string;
    videoUrl: string | null;
    status: Status;
    error: string | null;
    analysis: AnalysisResult | null;
    transcript: string | null;
    startedAt: string | null; // when the current analysis began
    children?: React.ReactNode; // shown between the video and the feedback
};

export default function RecordingWorkspace({
                                               id, videoUrl, status, error, analysis, transcript, startedAt, children,
                                           }: Props) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [running, setRunning] = useState(false);
    const [coachBusy, setCoachBusy] = useState(false);
    const [startError, setStartError] = useState<string | null>(null);
    const [now, setNow] = useState(0);

    const busy = running || status === "PROCESSING";
    const stuck = status === "PROCESSING" && !running && !!startedAt && now - new Date(startedAt).getTime() > STUCK_MS;

    // If the page loads while an analysis is running, keep checking until it finishes.
    useEffect(() => {
        if (status !== "PROCESSING" || running) return;
        setNow(Date.now());
        const t = setInterval(() => {
            setNow(Date.now());
            router.refresh();
        }, 4000);
        return () => clearInterval(t);
    }, [status, running, router]);

    async function post(query: string) {
        const res = await fetch(`/api/recordings/${id}/analyze${query}`, { method: "POST" });
        if (!res.ok && res.status !== 409) throw new Error();
    }

    async function analyze(force = false) {
        setRunning(true);
        setStartError(null);
        try {
            await post(force ? "?force=1" : "");
        } catch {
            setStartError("Couldn't start the analysis. Check your connection and try again.");
        }
        setRunning(false);
        router.refresh();
    }

    async function analyzeAgain() {
        if (window.confirm("Run the analysis again? This replaces the current results.")) await analyze(true);
    }

    async function retryCoach() {
        setCoachBusy(true);
        try {
            await post("?only=coach");
        } catch {
            // the refreshed page will still show why coaching is missing
        }
        setCoachBusy(false);
        router.refresh();
    }

    function seek(at: number) {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, at - 1);
        v.play().catch(() => {});
        v.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return (
        <div>
            <div className="overflow-hidden rounded-[28px] bg-black">
                {videoUrl ? (
                    <video ref={videoRef} src={videoUrl} controls playsInline className="aspect-video w-full" />
                ) : (
                    <p className="grid aspect-video place-items-center px-6 text-center text-sm text-[#C9C3B8]">
                        This recording can&apos;t be played right now. Refresh the page to try again.
                    </p>
                )}
            </div>

            {children}

            <section className="mt-8" aria-live="polite">
                {status === "DONE" && analysis ? (
                    <Results
                        analysis={analysis}
                        transcript={transcript}
                        seek={seek}
                        coachBusy={coachBusy}
                        onRetryCoach={retryCoach}
                        onAnalyzeAgain={analyzeAgain}
                        againBusy={running}
                    />
                ) : (
                    <div className={`${card} px-6 py-8`}>
                        <h2 className={`${display} text-xl font-extrabold`}>
                            {stuck ? "This is taking too long" : busy ? "Listening to your recording..." : "Get your feedback"}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4A5568]">
                            {stuck
                                ? "The last attempt seems to have stopped. You can safely start it again."
                                : busy
                                    ? "This usually takes under a minute."
                                    : "See your pace, filler words and pauses, plus coaching on what went well and what to work on."}
                        </p>

                        {busy && !stuck ? (
                            <div
                                className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-[#EFEAE2] border-t-[#14213D] motion-reduce:animate-none"
                                role="status"
                                aria-label="Analyzing"
                            />
                        ) : (
                            <button onClick={() => analyze()} disabled={running} className={`${btn} mt-6 ${focus}`}>
                                {stuck ? "Try again" : "Analyze this recording"}
                            </button>
                        )}

                        {(startError || (status === "FAILED" && error)) && !busy && (
                            <p role="alert" className="mt-4 text-sm font-semibold text-[#B3361B]">
                                {startError ?? error}
                            </p>
                        )}

                        <p className="mt-6 max-w-xl text-xs leading-relaxed text-[#4A5568]">
                            When you analyze, the audio is sent to AssemblyAI to be transcribed, and the transcript text goes to an AI
                            language-model provider to write your feedback. Your video stays in your private storage.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}

function Chips({ moments, seek }: { moments?: Moment[]; seek: (at: number) => void }) {
    if (!moments?.length) return null;
    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {moments.map((m, i) => (
                <button
                    key={i}
                    onClick={() => seek(m.at)}
                    className={`inline-flex items-center gap-1.5 rounded-full bg-[#EFEAE2] px-3 py-1.5 text-xs font-bold text-[#14213D] hover:bg-[#e4ddd2] ${focus}`}
                >
                    <Play size={11} className="fill-current" />
                    {formatDuration(Math.round(m.at))} &middot; {m.label}
                </button>
            ))}
        </div>
    );
}

type ResultsProps = {
    analysis: AnalysisResult;
    transcript: string | null;
    seek: (at: number) => void;
    coachBusy: boolean;
    onRetryCoach: () => void;
    onAnalyzeAgain: () => void;
    againBusy: boolean;
};

function Results({ analysis, transcript, seek, coachBusy, onRetryCoach, onAnalyzeAgain, againBusy }: ResultsProps) {
    const { metrics: m, insights, coach } = analysis;
    const strengths = insights.filter((i) => i.kind === "strength");
    const improves = insights.filter((i) => i.kind === "improve");
    const steady =
        m.paceWindows.length < 3 ? "—" : m.paceSteadiness < 0.15 ? "Steady" : m.paceSteadiness < 0.3 ? "Some swing" : "Uneven";

    const tiles = [
        { label: "Pace", value: m.enoughSpeech ? String(m.wpm) : "—", hint: "words a minute (130 to 160 is a comfy range)" },
        { label: "Filler words", value: m.enoughSpeech ? String(m.fillers.total) : "—", hint: `${m.fillers.perMinute} a minute` },
        { label: "Long pauses", value: m.enoughSpeech ? String(m.longPauses.length) : "—", hint: "2 seconds or more" },
        { label: "Steadiness", value: m.enoughSpeech ? steady : "—", hint: "how even your pace was" },
    ];

    return (
        <div className="grid gap-5">
            {coach ? (
                <div className="rounded-[28px] bg-[#14213D] px-7 py-7 text-[#FAF8F5]">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5FC3D4]">Your feedback</p>
                    <p className="mt-3 text-[15px] leading-relaxed">{coach.summary}</p>
                    {coach.nextFocus && (
                        <p className="mt-4 text-sm leading-relaxed text-[#C9C3B8]">
                            <span className="font-bold text-[#FAF8F5]">Focus next time: </span>
                            {coach.nextFocus}
                        </p>
                    )}
                </div>
            ) : m.enoughSpeech ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-[#EFEAE2] px-7 py-5">
                    <p className="max-w-xl text-sm leading-relaxed text-[#4A5568]">
                        The written coaching isn&apos;t available for this recording
                        {analysis.coachError ? `: ${analysis.coachError}.` : "."} The measurements below still apply.
                    </p>
                    <button onClick={onRetryCoach} disabled={coachBusy} className={`${smallBtn} ${focus}`}>
                        {coachBusy ? "Trying..." : "Retry coaching"}
                    </button>
                </div>
            ) : null}

            {m.enoughSpeech && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {tiles.map((t) => (
                        <div key={t.label} className={`${card} px-5 py-5`}>
                            <p className={eyebrow}>{t.label}</p>
                            <p className={`${display} mt-3 text-3xl font-extrabold leading-none`}>{t.value}</p>
                            <p className="mt-2 text-xs text-[#4A5568]">{t.hint}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                <div className={`${card} px-6 py-6`}>
                    <h2 className={`${display} flex items-center gap-2 text-lg font-bold`}>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#2FA66A] text-white"><Check size={15} /></span>
                        What went well
                    </h2>
                    <ul className="mt-4 grid gap-5">
                        {strengths.map((s) => (
                            <li key={s.title}>
                                <p className="text-sm font-bold">{s.title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{s.detail}</p>
                                <Chips moments={s.moments} seek={seek} />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={`${card} px-6 py-6`}>
                    <h2 className={`${display} flex items-center gap-2 text-lg font-bold`}>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FF7A59] text-sm font-extrabold text-[#14213D]">!</span>
                        What to work on
                    </h2>
                    <ul className="mt-4 grid gap-5">
                        {improves.map((s) => (
                            <li key={s.title}>
                                <p className="text-sm font-bold">{s.title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{s.detail}</p>
                                <Chips moments={s.moments} seek={seek} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {coach && (
                <div className={`${card} px-7 py-7`}>
                    <h2 className={`${display} text-lg font-bold`}>Coach notes</h2>
                    {coach.strengths.length > 0 && (
                        <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-[#4A5568]">
                            {coach.strengths.map((s, i) => (
                                <li key={i} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-[#2FA66A]" />{s}</li>
                            ))}
                        </ul>
                    )}
                    {coach.improvements.length > 0 && (
                        <ul className="mt-5 grid gap-4">
                            {coach.improvements.map((i, k) => (
                                <li key={k} className="text-sm leading-relaxed">
                                    <p className="font-bold">{i.issue}</p>
                                    <p className="mt-0.5 text-[#4A5568]">{i.tip}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {coach.structure && (
                        <p className="mt-5 border-t border-[#14213D]/10 pt-4 text-sm leading-relaxed text-[#4A5568]">
                            <span className="font-bold text-[#14213D]">Structure: </span>
                            {coach.structure}
                        </p>
                    )}
                </div>
            )}

            {transcript && (
                <details className={`${card} px-7 py-5`}>
                    <summary className={`cursor-pointer text-sm font-bold ${focus}`}>Read the transcript</summary>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#4A5568]">{transcript}</p>
                </details>
            )}

            <div className="flex justify-end">
                <button
                    onClick={onAnalyzeAgain}
                    disabled={againBusy}
                    className={`rounded-full px-4 py-2 text-xs font-bold text-[#4A5568] hover:bg-[#EFEAE2] hover:text-[#14213D] disabled:opacity-60 ${focus}`}
                >
                    {againBusy ? "Analyzing again..." : "Analyze again"}
                </button>
            </div>
        </div>
    );
}
