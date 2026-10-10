"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, Clock, Timer, Flame } from "lucide-react";
import { formatTotal } from "@/lib/format";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const eyebrow = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A5568]";
const btn =
    "inline-flex h-[52px] items-center rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

type SessionMetrics = {
    wpm: number;
    steadiness: number; // spread of pace between 15-second windows, lower = steadier
    fillersPerMin: number;
    longPauses: number; // count of pauses of 2s or more
    durationSec: number;
    improve: string[]; // titles of the work on items for that session
};
type Session = { at: string; seconds: number; m: SessionMetrics | null };

type Day = { label: string; seconds: number; title: string; today: boolean };
type Status = "improving" | "holding" | "slipping";
type Trend = {
    id: string;
    label: string;
    help: string;
    now: string;
    before: string;
    status: Status;
    statusText: string;
    band?: [number, number];
    points: { v: number; title: string }[];
};
type Focus = { title: string; count: number };
type Progress = { count: number; trends: Trend[]; focus: Focus[] };
type Stats = { count: number; total: number; avg: number; streak: number; days: Day[]; progress: Progress };

type Def = {
    id: string;
    label: string;
    help: string;
    get: (m: SessionMetrics) => number;
    fmt: (v: number) => string;
    // Lower score is better. For pace the score is the distance from the comfortable range.
    score: (v: number) => number;
    eps: number; // changes smaller than this count as "holding"
    band?: [number, number];
};

const PACE: [number, number] = [130, 160];

const DEFS: Def[] = [
    {
        id: "pace",
        label: "Pace",
        help: "Words per minute. 130 to 160 is comfortable to follow.",
        get: (m) => m.wpm,
        fmt: (v) => `${Math.round(v)} wpm`,
        score: (v) => Math.max(0, PACE[0] - v, v - PACE[1]),
        eps: 3,
        band: PACE,
    },
    {
        id: "fillers",
        label: "Filler words",
        help: "Ums, uhs and similar, per minute. Lower is better.",
        get: (m) => m.fillersPerMin,
        fmt: (v) => `${v.toFixed(1)} a min`,
        score: (v) => v,
        eps: 0.3,
    },
    {
        id: "pauses",
        label: "Long silences",
        help: "Gaps of 2 seconds or more, per minute. Lower is better.",
        get: (m) => m.longPauses / (m.durationSec / 60),
        fmt: (v) => `${v.toFixed(1)} a min`,
        score: (v) => v,
        eps: 0.2,
    },
    {
        id: "steady",
        label: "Steady pace",
        help: "How much your speed changes within a take. Lower is steadier.",
        get: (m) => m.steadiness,
        fmt: (v) => `${Math.round(v * 100)}% swing`,
        score: (v) => v,
        eps: 0.03,
    },
];

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const shortDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });

function buildProgress(sessions: Session[]): Progress {
    const items = sessions.filter((s): s is Session & { m: SessionMetrics } => s.m !== null);
    if (items.length < 2) return { count: items.length, trends: [], focus: [] };

    // Compare your most recent sessions with the ones before them.
    const recentN = Math.min(3, Math.max(1, Math.floor(items.length / 2)));
    const recent = items.slice(-recentN);
    const earlier = items.slice(0, -recentN);

    const trends: Trend[] = DEFS.map((def) => {
        const nowAvg = avg(recent.map((s) => def.get(s.m)));
        const beforeAvg = avg(earlier.map((s) => def.get(s.m)));
        const delta = def.score(nowAvg) - def.score(beforeAvg);

        let status: Status = "holding";
        if (delta < -def.eps) status = "improving";
        else if (delta > def.eps) status = "slipping";

        let statusText = status === "improving" ? "Improving" : status === "slipping" ? "Slipping" : "Holding steady";
        if (def.id === "pace" && def.score(nowAvg) === 0 && status !== "slipping") statusText = "In range";

        return {
            id: def.id,
            label: def.label,
            help: def.help,
            now: def.fmt(nowAvg),
            before: def.fmt(beforeAvg),
            status,
            statusText,
            band: def.band,
            points: items.map((s) => ({
                v: def.get(s.m),
                title: `${shortDate(s.at)}: ${def.fmt(def.get(s.m))}`,
            })),
        };
    });

    // The issues that come up most often across sessions.
    const counts = new Map<string, number>();
    for (const s of items) {
        for (const t of new Set(s.m.improve)) {
            if (t.startsWith("Next level")) continue; // placeholder shown when nothing else was found
            counts.set(t, (counts.get(t) ?? 0) + 1);
        }
    }
    const focus = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([title, count]) => ({ title, count }));

    return { count: items.length, trends, focus };
}

function compute(sessions: Session[]): Stats {
    const perDay = new Map<string, number>();
    let total = 0;
    for (const s of sessions) {
        total += s.seconds;
        const k = key(new Date(s.at));
        perDay.set(k, (perDay.get(k) ?? 0) + s.seconds);
    }

    const days: Day[] = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const seconds = perDay.get(key(d)) ?? 0;
        days.push({
            label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
            seconds,
            title: `${d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}: ${
                seconds ? formatTotal(seconds) : "no practice"
            }`,
            today: i === 0,
        });
    }

    // Streak: consecutive practice days, counted back from today (or yesterday if nothing yet today).
    const cursor = new Date();
    if (!perDay.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (perDay.has(key(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return {
        count: sessions.length,
        total,
        avg: sessions.length ? Math.round(total / sessions.length) : 0,
        streak,
        days,
        progress: buildProgress(sessions),
    };
}

const statusStyle: Record<Status, string> = {
    improving: "bg-[#2FA66A]/15 text-[#1B6B44]",
    holding: "bg-[#EFEAE2] text-[#4A5568]",
    slipping: "bg-[#F5A524]/20 text-[#7A4B00]",
};

function TrendChart({ points, band, label }: { points: Trend["points"]; band?: [number, number]; label: string }) {
    const W = 300;
    const H = 90;
    const pad = 10;
    const vals = points.map((p) => p.v);
    let lo = Math.min(...vals, ...(band ? [band[0]] : []));
    let hi = Math.max(...vals, ...(band ? [band[1]] : []));
    if (hi - lo < 1e-6) {
        lo -= 1;
        hi += 1;
    }
    const x = (i: number) => (points.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (points.length - 1));
    const y = (v: number) => H - pad - ((v - lo) / (hi - lo)) * (H - pad * 2);

    return (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="mt-3 h-24 w-full">
            {band && (
                <rect
                    x={0}
                    y={y(band[1])}
                    width={W}
                    height={Math.max(2, y(band[0]) - y(band[1]))}
                    fill="#2FA66A"
                    opacity={0.14}
                />
            )}
            <polyline
                points={points.map((p, i) => `${x(i)},${y(p.v)}`).join(" ")}
                fill="none"
                stroke="#1F7A8C"
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
            {points.map((p, i) => (
                <circle
                    key={i}
                    cx={x(i)}
                    cy={y(p.v)}
                    r={i === points.length - 1 ? 5 : 3.5}
                    fill={i === points.length - 1 ? "#14213D" : "#1F7A8C"}
                >
                    <title>{p.title}</title>
                </circle>
            ))}
        </svg>
    );
}

function ProgressSection({ progress, notAnalyzed }: { progress: Progress; notAnalyzed: number }) {
    if (progress.count < 2) {
        return (
            <div className="mt-5 rounded-[28px] border-2 border-dashed border-[#14213D]/15 px-6 py-8 text-center">
                <p className={`${display} text-base font-bold`}>Your progress will show up here</p>
                <p className="mx-auto mt-1 max-w-md text-sm text-[#4A5568]">
                    {progress.count === 0
                        ? "Analyze a recording to start tracking your pace, filler words and silences."
                        : "You have 1 analyzed recording. Analyze one more and we can show how you are changing."}
                </p>
                {notAnalyzed > 0 && (
                    <Link href="/recordings" className={`mt-4 inline-block text-sm font-semibold text-[#1F7A8C] underline ${focusRing}`}>
                        Open My recordings
                    </Link>
                )}
            </div>
        );
    }

    return (
        <section className="mt-8" aria-labelledby="progress-heading">
            <h2 id="progress-heading" className={`${display} text-xl font-extrabold`}>
                Your speaking progress
            </h2>
            <p className="mt-1 text-sm text-[#4A5568]">
                Based on {progress.count} analyzed {progress.count === 1 ? "recording" : "recordings"}. Each card compares
                your latest sessions with the ones before.
                {progress.count < 5 && " The picture gets more reliable after about five."}
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {progress.trends.map((t) => (
                    <div key={t.id} className={`${card} px-5 py-5`}>
                        <div className="flex items-start justify-between gap-3">
                            <h3 className={`${display} text-base font-bold`}>{t.label}</h3>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle[t.status]}`}>
                                {t.statusText}
                            </span>
                        </div>
                        <p className={`${display} mt-3 text-2xl font-extrabold leading-none`}>{t.now}</p>
                        <p className="mt-1 text-xs text-[#4A5568]">Before: {t.before}</p>
                        <TrendChart
                            points={t.points}
                            band={t.band}
                            label={`${t.label} across your ${t.points.length} analyzed sessions, oldest to newest`}
                        />
                        <p className="mt-1 text-xs text-[#4A5568]">{t.help}</p>
                    </div>
                ))}
            </div>

            {progress.focus.length > 0 && (
                <div className={`${card} mt-4 px-6 py-6`}>
                    <h3 className={`${display} text-base font-bold`}>What keeps coming up</h3>
                    <ul className="mt-3 grid gap-2.5">
                        {progress.focus.map((f) => (
                            <li key={f.title} className="flex items-center justify-between gap-4 text-sm">
                                <span className="font-semibold text-[#14213D]">{f.title}</span>
                                <span className="text-[#4A5568]">
                                    {f.count} of {progress.count} sessions
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {notAnalyzed > 0 && (
                <p className="mt-3 text-xs text-[#4A5568]">
                    {notAnalyzed} {notAnalyzed === 1 ? "recording isn't" : "recordings aren't"} analyzed yet, so{" "}
                    {notAnalyzed === 1 ? "it isn't" : "they aren't"} counted.{" "}
                    <Link href="/recordings" className={`font-semibold text-[#1F7A8C] underline ${focusRing}`}>
                        Open My recordings
                    </Link>
                </p>
            )}
        </section>
    );
}

export default function AnalyticsView({ sessions, notAnalyzed }: { sessions: Session[]; notAnalyzed: number }) {
    const [stats, setStats] = useState<Stats | null>(null);
    useEffect(() => setStats(compute(sessions)), [sessions]);

    if (sessions.length === 0) {
        return (
            <div className={`${card} px-6 py-16 text-center`}>
                <h2 className={`${display} text-2xl font-extrabold`}>Nothing to show yet</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#4A5568]">
                    Save your first practice session and your stats will start building here.
                </p>
                <Link href="/practice" className={`${btn} mt-7`}>Start practicing</Link>
            </div>
        );
    }

    const tiles = [
        { icon: Mic, label: "Sessions", value: stats ? String(stats.count) : "—" },
        { icon: Clock, label: "Practice time", value: stats ? formatTotal(stats.total) : "—" },
        { icon: Timer, label: "Average length", value: stats ? formatTotal(stats.avg) : "—" },
        { icon: Flame, label: "Day streak", value: stats ? String(stats.streak) : "—" },
    ];
    const max = stats ? Math.max(...stats.days.map((d) => d.seconds), 1) : 1;

    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {tiles.map(({ icon: Icon, label, value }) => (
                    <div key={label} className={`${card} px-5 py-5`}>
                        <Icon size={18} className="text-[#1F7A8C]" />
                        <p className={`${display} mt-4 text-3xl font-extrabold leading-none`}>{value}</p>
                        <p className={`${eyebrow} mt-2`}>{label}</p>
                    </div>
                ))}
            </div>

            {stats && <ProgressSection progress={stats.progress} notAnalyzed={notAnalyzed} />}

            <div className={`${card} mt-8 px-6 py-6`}>
                <h2 className={`${display} text-base font-bold`}>Practice in the last 14 days</h2>
                <div
                    role="img"
                    aria-label="Practice time per day over the last 14 days"
                    className="mt-6 flex h-40 items-end gap-1.5 sm:gap-2"
                >
                    {stats?.days.map((d, i) => (
                        <div key={i} title={d.title} className="flex h-full flex-1 flex-col justify-end gap-2">
                            <div
                                className={`w-full rounded-t-lg ${
                                    d.seconds === 0 ? "bg-[#EFEAE2]" : d.today ? "bg-[#14213D]" : "bg-[#1F7A8C]"
                                }`}
                                style={{ height: d.seconds === 0 ? 4 : `${Math.max(6, (d.seconds / max) * 100)}%` }}
                            />
                            <span className="text-center text-[10px] font-semibold text-[#4A5568]">{d.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}