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

type Session = { at: string; seconds: number };
type Day = { label: string; seconds: number; title: string; today: boolean };
type Stats = { count: number; total: number; avg: number; streak: number; days: Day[] };

const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Computed in the browser so "today" and day boundaries use the viewer's timezone.
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

    return { count: sessions.length, total, avg: sessions.length ? Math.round(total / sessions.length) : 0, streak, days };
}

export default function AnalyticsView({ sessions }: { sessions: Session[] }) {
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

            <div className={`${card} mt-5 px-6 py-6`}>
                <h2 className={`${display} text-base font-bold`}>Last 14 days</h2>
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

            {/* TODO: add pace, filler-word and clarity trends once the analysis step exists */}
            <div className="mt-5 rounded-[28px] border-2 border-dashed border-[#14213D]/15 px-6 py-6 text-center">
                <p className="text-sm text-[#4A5568]">
                    Pace, filler words and clarity trends will show up here once analysis is switched on.
                </p>
            </div>
        </>
    );
}