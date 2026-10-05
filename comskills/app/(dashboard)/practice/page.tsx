"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowRight, CircleCheck, MessageCircleQuestion, Play, X } from "lucide-react";
import Recorder from "@/components/Recorder";
import { formatTime, type RecordingResult } from "@/hooks/useRecorder";
import { uploadRecording } from "@/lib/uploadRecording";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const BARS = [10, 18, 26, 14, 22, 12, 20, 28, 16, 24, 12, 18];

export default function PracticePage() {
    const router = useRouter();
    const [result, setResult] = useState<RecordingResult | null>(null);
    const [watching, setWatching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // While a take is unsaved: warn before the tab closes, and free the blob when it goes away.
    useEffect(() => {
        if (!result) return;
        const warn = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", warn);
        return () => {
            window.removeEventListener("beforeunload", warn);
            URL.revokeObjectURL(result.url);
        };
    }, [result]);

    function discard() {
        setResult(null);
        setWatching(false);
        setSaveError(null);
    }

    async function save() {
        if (!result) return;
        setSaving(true);
        setSaveError(null);
        try {
            const { id } = await uploadRecording(result);
            router.push(`/recordings/${id}`);
        } catch {
            setSaveError("Couldn't save the recording. Check your connection and try again.");
            setSaving(false);
        }
    }

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>
                    Presentation practice
                </h1>
            </div>

            {!result ? (
                <Recorder onComplete={setResult} />
            ) : (
                <>
                    <div role="status" className={`${card} mb-6 flex items-start gap-3.5 px-[22px] py-[18px]`}>
            <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-xl bg-[#2FA66A]/10 text-[#2FA66A]">
              <CircleCheck size={20} />
            </span>
                        <div>
                            <h2 className={`${display} text-base font-bold`}>Save your recording</h2>
                            <p className="text-sm leading-normal text-[#4A5568]">
                                First session done. Save it to see your pace, filler words, and clarity.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -right-2.5 -top-4 z-10 rotate-[4deg] rounded-[18px] bg-white px-[18px] py-3 shadow-[0_16px_36px_-14px_rgba(20,33,61,0.45)] max-md:right-0">
                            <b className={`${display} flex items-center gap-2 text-sm font-extrabold`}>
                                <span className="h-2 w-2 rounded-full bg-[#FF7A59]" />
                                Not saved yet
                            </b>
                            <span className="mt-0.5 block text-xs text-[#4A5568]">Save to keep this take.</span>
                        </div>

                        <div className="relative grid aspect-video place-items-center overflow-hidden rounded-[28px] bg-[#14213D] p-6 text-center">
                            <video
                                key={watching ? "play" : "bg"}
                                src={result.url}
                                controls={watching}
                                muted={!watching}
                                playsInline
                                className={`absolute inset-0 h-full w-full ${
                                    watching ? "bg-black object-contain" : "object-cover opacity-20 blur-[6px]"
                                }`}
                            />
                            {watching ? (
                                <button
                                    onClick={() => setWatching(false)}
                                    aria-label="Close playback"
                                    className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-[#14213D]/70 text-[#FAF8F5] hover:bg-[#14213D]"
                                >
                                    <X size={16} />
                                </button>
                            ) : (
                                <>
                                    <div className="relative flex flex-col items-center gap-6">
                                        <h2
                                            className={`${display} max-w-[11ch] text-[clamp(30px,6vw,68px)] font-extrabold leading-[0.98] text-[#FAF8F5]`}
                                        >
                                            You ended the presentation
                                        </h2>
                                        <button
                                            onClick={() => setWatching(true)}
                                            className="inline-flex items-center gap-2 rounded-full bg-[#FAF8F5] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#14213D] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF8F5]"
                                        >
                                            <Play size={14} /> Watch it back
                                        </button>
                                    </div>
                                    <span className="absolute bottom-[18px] left-5 rounded-full bg-[#FAF8F5]/15 px-3 py-1 font-mono text-xs font-semibold text-[#FAF8F5]">
                    {formatTime(result.seconds)}
                  </span>
                                    <span aria-hidden="true" className="absolute bottom-5 right-6 flex h-[30px] items-center gap-1">
                    {BARS.map((h, i) => (
                        <i key={i} style={{ height: h }} className="w-[5px] rounded-[3px] bg-[#5FC3D4]" />
                    ))}
                  </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                        <button
                            onClick={discard}
                            disabled={saving}
                            aria-label="Discard and record again"
                            title="Discard and record again"
                            className={`grid h-[52px] w-[52px] place-items-center rounded-full bg-[#EFEAE2] hover:bg-[#e4ddd2] disabled:opacity-60 ${focus}`}
                        >
                            <RotateCcw size={18} />
                        </button>
                        <button
                            onClick={save}
                            disabled={saving}
                            className={`inline-flex h-[52px] items-center gap-2.5 rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] disabled:cursor-progress disabled:opacity-60 ${focus}`}
                        >
                            {saving ? (
                                "Saving..."
                            ) : (
                                <>
                                    Save &amp; view analysis <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                        {/* TODO: enable once the follow-up flow exists */}
                        <button
                            disabled
                            title="Coming soon"
                            className="inline-flex items-center gap-2 px-1 py-2.5 text-xs font-extrabold uppercase tracking-[0.14em] opacity-40"
                        >
                            <MessageCircleQuestion size={16} /> Ask me follow-up questions
                        </button>
                    </div>

                    {saveError ? (
                        <p role="alert" className="mt-4 text-sm font-semibold text-[#B3361B]">
                            {saveError}
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-[#4A5568]">
                            Your video stays on this device until you save it. Discarding deletes it for good.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}