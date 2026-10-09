"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { TOUR_KEY } from "@/components/SeeHowItWorks";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

// ---------- Illustrations (example data, not real screens) ----------

const field = "h-9 rounded-lg border border-[#8A94A6]/40 bg-white px-3 text-[11px] leading-9 text-[#8A94A6]";
const chipGood = "rounded-full bg-[#E3F4EA] px-2.5 py-1 text-[10px] font-bold text-[#14452B]";
const chipPlain = "rounded-full bg-[#EFEAE2] px-2.5 py-1 text-[10px] font-bold text-[#4A5568]";

function SignUpMock() {
    return (
        <div className="mx-auto max-w-[300px] rounded-2xl bg-[#FAF8F5] p-5">
            <p className={`${display} text-xl font-bold text-[#14213D]`}>Sign up</p>
            <div className="mt-4 grid gap-2.5">
                <div className={field}>Full name</div>
                <div className={field}>E-mail</div>
                <div className={field}>Password</div>
            </div>
            <div className="mt-3 rounded-lg bg-[#FF7A59] py-2.5 text-center text-xs font-bold text-[#14213D]">Create account</div>
            <p className="my-3 text-center text-[10px] font-bold text-[#8A94A6]">OR</p>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-[#8A94A6]/40 bg-white py-2 text-center text-[11px] font-semibold text-[#14213D]">Google</div>
                <div className="rounded-lg border border-[#8A94A6]/40 bg-white py-2 text-center text-[11px] font-semibold text-[#14213D]">Facebook</div>
            </div>
        </div>
    );
}

function PracticeMock() {
    return (
        <div className="relative mx-auto aspect-video max-w-[420px] overflow-hidden rounded-2xl bg-[#14213D]">
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-[#FF7A59] motion-safe:animate-pulse" />
                Recording 0:42
            </div>
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-[#1F7A8C]" />
                <div className="mt-1 h-20 w-40 rounded-t-full bg-[#1F7A8C]" />
            </div>
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-4">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">Discard</span>
                <span className="grid h-11 w-11 place-items-center rounded-full border-4 border-white">
                    <span className="h-4 w-4 rounded-sm bg-[#FF7A59]" />
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#14213D]">Save</span>
            </div>
        </div>
    );
}

function RecordingsMock() {
    const rows = [
        { when: "Today, 6:21 PM", meta: "0:45 · 4.2 MB", status: "Analyzed", good: true },
        { when: "Yesterday, 7:02 PM", meta: "1:10 · 6.8 MB", status: "Analyzed", good: true },
        { when: "Mon, 5:48 PM", meta: "0:31 · 2.3 MB", status: "Not analyzed", good: false },
    ];
    return (
        <div className="mx-auto grid max-w-[360px] gap-2.5">
            <p className={`${display} text-lg font-bold text-[#14213D]`}>My recordings</p>
            {rows.map((r) => (
                <div key={r.when} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <div>
                        <p className={`${display} text-[13px] font-bold text-[#14213D]`}>{r.when}</p>
                        <p className="mt-0.5 text-[11px] text-[#4A5568]">{r.meta}</p>
                    </div>
                    <span className={r.good ? chipGood : chipPlain}>{r.status}</span>
                </div>
            ))}
        </div>
    );
}

function FeedbackMock() {
    const tiles = [
        ["Pace", "148 wpm"],
        ["Filler words", "1.8 a min"],
        ["Long silences", "1"],
        ["Steady pace", "12% swing"],
    ];
    return (
        <div className="mx-auto grid max-w-[380px] gap-3">
            <div className="grid grid-cols-2 gap-2.5">
                {tiles.map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-white px-3.5 py-3 shadow-sm">
                        <p className="text-[10px] font-semibold text-[#4A5568]">{k}</p>
                        <p className={`${display} mt-1 text-base font-extrabold text-[#14213D]`}>{v}</p>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                    <p className="text-[11px] font-bold text-[#14452B]">What went well</p>
                    <p className="mt-1.5 text-[11px] text-[#14213D]">Comfortable pace</p>
                    <p className="mt-1 text-[11px] text-[#14213D]">You use pauses well</p>
                </div>
                <div className="rounded-2xl bg-white p-3.5 shadow-sm">
                    <p className="text-[11px] font-bold text-[#6B4200]">What to work on</p>
                    <p className="mt-1.5 text-[11px] text-[#14213D]">Filler words</p>
                    <div className="mt-1.5 flex gap-1.5">
                        {["0:12", "0:31", "1:04"].map((t) => (
                            <span key={t} className="rounded-full bg-[#1F7A8C] px-2 py-0.5 text-[10px] font-bold text-white">{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnalyticsMock() {
    return (
        <div className="mx-auto grid max-w-[380px] gap-3">
            <div className="grid grid-cols-3 gap-2.5">
                {[
                    ["Sessions", "6"],
                    ["Practice time", "8 min"],
                    ["Day streak", "3"],
                ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl bg-white px-3 py-3 shadow-sm">
                        <p className={`${display} text-lg font-extrabold text-[#14213D]`}>{v}</p>
                        <p className="mt-0.5 text-[10px] font-semibold text-[#4A5568]">{k}</p>
                    </div>
                ))}
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <p className={`${display} text-[13px] font-bold text-[#14213D]`}>Pace</p>
                    <span className={chipGood}>Improving</span>
                </div>
                <svg viewBox="0 0 300 90" className="mt-2 h-24 w-full">
                    <rect x="0" y="33" width="300" height="37" fill="#2FA66A" opacity="0.14" />
                    <polyline
                        points="20,18 85,27 150,35 215,43 280,48"
                        fill="none"
                        stroke="#1F7A8C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {[
                        [20, 18],
                        [85, 27],
                        [150, 35],
                        [215, 43],
                    ].map(([x, y]) => (
                        <circle key={x} cx={x} cy={y} r="3.5" fill="#1F7A8C" />
                    ))}
                    <circle cx="280" cy="48" r="5" fill="#14213D" />
                </svg>
                <p className="text-[10px] text-[#4A5568]">Green band: the comfortable range</p>
            </div>
        </div>
    );
}

function LearningMock() {
    const lessons = [
        { t: "Control your pace", done: true },
        { t: "Cut filler words", done: true },
        { t: "Use pauses on purpose", done: false },
    ];
    return (
        <div className="mx-auto grid max-w-[360px] gap-2.5">
            <div className="flex items-end justify-between">
                <p className={`${display} text-lg font-bold text-[#14213D]`}>My learning</p>
                <p className="text-[11px] font-semibold text-[#4A5568]">2 of 3 done</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full w-2/3 rounded-full bg-[#2FA66A]" />
            </div>
            {lessons.map((l) => (
                <div key={l.t} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                            l.done ? "bg-[#2FA66A] text-white" : "border-2 border-[#8A94A6]/40"
                        }`}
                    >
                        {l.done && <Check size={14} strokeWidth={3} />}
                    </span>
                    <p className="text-[13px] font-semibold text-[#14213D]">{l.t}</p>
                </div>
            ))}
        </div>
    );
}


// A friendly speech-bubble mascot with a microphone, drawn inline so this page has no extra dependencies.
function EchoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 240 300" className={className} aria-hidden="true" focusable="false">
            <ellipse cx="120" cy="291" rx="72" ry="8" fill="#14213D" opacity="0.12" />
            {/* microphone */}
            <rect x="96" y="8" width="36" height="60" rx="18" fill="#1F7A8C" />
            <path d="M80 48 Q80 100 114 100 Q148 100 148 48" fill="none" stroke="#1F7A8C" strokeWidth="6" strokeLinecap="round" />
            <line x1="114" y1="100" x2="114" y2="116" stroke="#1F7A8C" strokeWidth="6" strokeLinecap="round" />
            {/* speech bubble */}
            <rect x="20" y="110" width="200" height="150" rx="46" fill="#14213D" />
            <path d="M50 232 L26 290 L116 244 Z" fill="#14213D" />
            {/* face */}
            <circle cx="82" cy="170" r="17" fill="#fff" />
            <circle cx="152" cy="170" r="17" fill="#fff" />
            <circle cx="87" cy="172" r="8" fill="#14213D" />
            <circle cx="157" cy="172" r="8" fill="#14213D" />
            <circle cx="50" cy="204" r="14" fill="#E0714F" />
            <circle cx="190" cy="204" r="14" fill="#E0714F" />
            <path d="M92 204 Q120 230 148 204" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
}

// ---------- The steps ----------

type Step = { title: string; body: string; where: string; mock: ReactNode };

const STEPS: Step[] = [
    {
        title: "Create your account",
        body: "Sign up with your email, Google or Facebook. Your recordings and progress are saved to your account, so everything stays in one place.",
        where: "Sign up, top right of the navbar",
        mock: <SignUpMock />,
    },
    {
        title: "Record a practice session",
        body: "Open Practice, allow your camera and microphone, and speak. Record at least 20 seconds so there is enough to analyze. When you stop, save the take or discard it and try again.",
        where: "Practice, in the navbar",
        mock: <PracticeMock />,
    },
    {
        title: "Find your recordings",
        body: "Every saved take appears in My recordings, newest first, with its length and whether it has been analyzed. Open one to replay it.",
        where: "Your name in the navbar, then My recordings",
        mock: <RecordingsMock />,
    },
    {
        title: "Get feedback on a recording",
        body: "Open a recording and choose Analyze. You get your pace, filler words, long silences and how steady you were, plus what went well and what to work on. Tap a time to jump to that moment in the video.",
        where: "Open any recording from My recordings",
        mock: <FeedbackMock />,
    },
    {
        title: "Watch your progress",
        body: "Analytics shows how your speaking changes over time. Each measure compares your latest sessions with your earlier ones, so you can see what is improving and what keeps coming up. It needs at least two analyzed recordings.",
        where: "Analytics, in your dashboard",
        mock: <AnalyticsMock />,
    },
    {
        title: "Practice with lessons",
        body: "My learning has short lessons for the skills your feedback points to. Mark each lesson complete to keep track of what you have covered.",
        where: "My learning, in your dashboard",
        mock: <LearningMock />,
    },
];

// ---------- Page ----------

export default function HowItWorks() {
    const router = useRouter();
    const [allowed, setAllowed] = useState(false);

    // This page opens only when the visitor arrived through the "See how it works" button.
    useEffect(() => {
        let ok = false;
        try {
            ok = sessionStorage.getItem(TOUR_KEY) === "1";
        } catch {
            ok = false;
        }
        if (ok) setAllowed(true);
        else router.replace("/");
    }, [router]);

    if (!allowed) return null;

    return (
        // Own background, so the page stays cream even when the browser is in dark mode.
        <div className="min-h-screen bg-[#FAF8F5]" style={{ background: "#FAF8F5", minHeight: "100vh" }}>
            <main className="w-full px-6 pb-24 pt-6 lg:px-10 xl:px-16">
                <Link
                    href="/"
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5568] hover:text-[#14213D] ${focus}`}
                >
                    <ArrowLeft size={16} aria-hidden="true" /> Back to home
                </Link>

                <header className="max-w-[760px] pb-12 pt-8 xl:pb-16">
                    <h1 className={`${display} text-[clamp(36px,5.5vw,76px)] font-extrabold leading-[1.02] text-[#14213D]`}>
                        How Comskill works
                    </h1>
                    <p className="mt-4 text-base leading-relaxed text-[#4A5568] xl:text-lg">
                        Record yourself speaking, get specific feedback, and watch your delivery improve. These are the pages you
                        will use, in the order you will use them.
                    </p>
                </header>

                <ol className="relative before:absolute before:bottom-0 before:left-[17px] before:top-0 before:w-0.5 before:bg-[#14213D]/10 lg:before:left-[19px]">
                    {STEPS.map((s, i) => (
                        <li key={s.title} className="relative pb-14 pl-14 last:pb-4 lg:pl-16 xl:pb-20">
                        <span
                            className={`${display} absolute left-0 top-0 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#14213D] text-sm font-bold text-white lg:h-10 lg:w-10`}
                        >
                            {i + 1}
                        </span>

                            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 xl:gap-20">
                                <div>
                                    <h2 className={`${display} text-2xl font-extrabold text-[#14213D] xl:text-4xl`}>{s.title}</h2>
                                    <p className="mt-3 max-w-[50ch] text-[15px] leading-relaxed text-[#4A5568] xl:mt-4 xl:text-lg">{s.body}</p>
                                    <p className="mt-4 text-sm text-[#4A5568] xl:text-base">
                                        <span className="font-semibold text-[#14213D]">Where to find it:</span> {s.where}
                                    </p>
                                </div>

                                <div aria-hidden="true" className="rounded-[28px] bg-[#EFEAE2] p-5 sm:p-7 xl:p-12">
                                    <div className="lg:[zoom:1.2] xl:[zoom:1.55]">{s.mock}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>

                <p className="mt-2 text-xs text-[#4A5568]">The screens above are illustrations with example numbers.</p>
            </main>

            {/* Closing call to action: full-width band */}
            <section className="overflow-hidden bg-[#EFEAE2]">
                <div className="flex w-full flex-col items-start gap-8 px-6 py-12 lg:flex-row lg:items-center lg:gap-14 lg:px-10 xl:px-16 xl:py-14">
                    <EchoMark className="h-[190px] w-auto shrink-0 xl:h-[260px]" />

                    <div className="flex-1">
                        <h2 className={`${display} text-[clamp(36px,5vw,72px)] font-extrabold leading-[1.02] text-[#14213D]`}>
                            Ready to find your voice?
                        </h2>
                        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-[#4A5568] xl:text-lg">
                            Create an account and record your first session in minutes. Comskill will be waiting.
                        </p>
                    </div>

                    <Link
                        href="/practice"
                        className={`inline-flex h-[52px] shrink-0 items-center rounded-full bg-[#14213D] px-[30px] font-[family-name:var(--font-sora)] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_-10px_rgba(20,33,61,0.55)] hover:bg-[#1d2f55] ${focus}`}
                    >
                        Get started
                    </Link>
                </div>
            </section>
        </div>
    );
}