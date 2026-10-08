import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { LESSONS } from "@/lib/lessons";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const btn =
    "inline-flex h-[52px] items-center rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55]";

export default async function LearningPage() {
    const userId = await getUserId();
    if (!userId) redirect("/signup");

    const rows = await prisma.lessonProgress.findMany({ where: { userId }, select: { lessonSlug: true } });
    const done = new Set(rows.map((r) => r.lessonSlug));
    const completed = LESSONS.filter((l) => done.has(l.slug)).length;
    const next = LESSONS.find((l) => !done.has(l.slug));
    const pct = Math.round((completed / LESSONS.length) * 100);

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>My learning</h1>
            </div>

            <div className={`${card} flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between`}>
                <div className="flex-1">
                    <p className={`${display} text-lg font-bold`}>
                        {completed} of {LESSONS.length} lessons complete
                    </p>
                    <div
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="Lessons completed"
                        className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#EFEAE2]"
                    >
                        <div className="h-full rounded-full bg-[#2FA66A]" style={{ width: `${pct}%` }} />
                    </div>
                </div>
                {next ? (
                    <Link href={`/learning/${next.slug}`} className={`${btn} ${focus}`}>Continue</Link>
                ) : (
                    <p className="text-sm font-semibold text-[#1d7a4d]">All lessons complete</p>
                )}
            </div>

            <ol className="mt-5 grid gap-4">
                {LESSONS.map((l, i) => {
                    const isDone = done.has(l.slug);
                    return (
                        <li key={l.slug}>
                            <Link
                                href={`/learning/${l.slug}`}
                                className={`${card} flex items-start gap-4 px-6 py-5 hover:-translate-y-0.5 motion-safe:transition-transform ${focus}`}
                            >
                <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                        isDone ? "bg-[#2FA66A] text-white" : "bg-[#EFEAE2] text-[#14213D]"
                    }`}
                >
                  {isDone ? <Check size={18} /> : i + 1}
                </span>
                                <div>
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1F7A8C]">
                                        {l.focus} &middot; {l.minutes} min
                                    </p>
                                    <h2 className={`${display} mt-1 text-lg font-bold`}>{l.title}</h2>
                                    <p className="mt-1 text-sm text-[#4A5568]">{l.summary}</p>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}