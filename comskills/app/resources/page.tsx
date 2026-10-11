import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, DRILLS, FACTS, READING } from "@/lib/resources";
import ResourcesCta from "@/components/ResourcesCta";

export const metadata: Metadata = {
    title: "Resources | Comskill",
    description: "Short guides and practice drills for clearer, calmer speaking.",
};

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

const JUMPS = [
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.title })),
    { id: "drills", label: "Practice drills" },
    ...(READING.length ? [{ id: "reading", label: "Keep learning" }] : []),
];

function SectionHead({ id, title, blurb }: { id: string; title: string; blurb: string }) {
    return (
        <div className="max-w-[640px]">
            <h2 id={`${id}-h`} className={`${display} text-3xl font-extrabold text-[#14213D] xl:text-4xl`}>
                {title}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568] xl:text-base">{blurb}</p>
        </div>
    );
}

export default function ResourcesPage() {
    return (
        <div className="bg-[#FAF8F5]" style={{ background: "#FAF8F5" }}>
            <div className="w-full px-6 pb-24 pt-10 lg:px-10 xl:px-16">
                {/* Header */}
                <header className="max-w-[760px] pb-10 xl:pb-14">
                    <h1 className={`${display} text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.03] text-[#14213D]`}>
                        Resources
                    </h1>
                    <p className="mt-5 text-base leading-relaxed text-[#4A5568] xl:text-lg">
                        Short guides and drills for clearer, calmer speaking. They are written to go with the feedback Comskill
                        gives you, so you can read a tip and try it in your next take.
                    </p>
                </header>

                {/* Key numbers */}
                <section aria-labelledby="numbers-h">
                    <h2 id="numbers-h" className="sr-only">
                        Numbers worth knowing
                    </h2>
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {FACTS.map((f) => (
                            <li key={f.label} className={`${card} px-6 py-6`}>
                                <p className="font-[family-name:var(--font-sora)] text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A5568]">
                                    {f.label}
                                </p>
                                <p className={`${display} mt-3 text-3xl font-extrabold leading-none text-[#14213D]`}>{f.value}</p>
                                <p className="mt-1 text-sm font-semibold text-[#1F7A8C]">{f.unit}</p>
                                <p className="mt-3 text-sm leading-relaxed text-[#4A5568]">{f.note}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Jump links */}
                <nav aria-label="On this page" className="mt-12">
                    <ul className="flex flex-wrap gap-2.5">
                        {JUMPS.map((j) => (
                            <li key={j.id}>
                                <a
                                    href={`#${j.id}`}
                                    className={`inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14213D] shadow-sm hover:bg-[#EFEAE2] ${focus}`}
                                >
                                    {j.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Guides */}
                {CATEGORIES.map((cat) => (
                    <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-h`} className="mt-16 scroll-mt-28 xl:mt-20">
                        <SectionHead id={cat.id} title={cat.title} blurb={cat.blurb} />
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {cat.guides.map((g) => (
                                <article key={g.title} className={`${card} px-7 py-7`}>
                                    <h3 className={`${display} text-xl font-bold text-[#14213D]`}>{g.title}</h3>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568]">{g.summary}</p>
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[#14213D]">
                                        {g.tips.map((t) => (
                                            <li key={t} className="pl-1">
                                                {t}
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Drills */}
                <section id="drills" aria-labelledby="drills-h" className="mt-16 scroll-mt-28 xl:mt-20">
                    <SectionHead
                        id="drills"
                        title="Practice drills"
                        blurb="Short exercises you can do today. Each one pairs with a recording, so you can see the change in your results."
                    />
                    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {DRILLS.map((d) => (
                            <article key={d.title} className={`${card} flex flex-col px-7 py-7`}>
                                <p className="w-fit rounded-full bg-[#EFEAE2] px-3 py-1 text-xs font-bold text-[#14213D]">{d.time}</p>
                                <h3 className={`${display} mt-4 text-xl font-bold text-[#14213D]`}>{d.title}</h3>
                                <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-[#4A5568] marker:font-bold marker:text-[#1F7A8C]">
                                    {d.steps.map((s) => (
                                        <li key={s} className="pl-1">
                                            {s}
                                        </li>
                                    ))}
                                </ol>
                                <Link
                                    href="/practice"
                                    className={`mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#1F7A8C] underline underline-offset-4 hover:text-[#14213D] ${focus}`}
                                >
                                    Try it in Practice <ArrowUpRight size={16} aria-hidden="true" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Further reading (only when you add some) */}
                {READING.length > 0 && (
                    <section id="reading" aria-labelledby="reading-h" className="mt-16 scroll-mt-28 xl:mt-20">
                        <SectionHead
                            id="reading"
                            title="Keep learning"
                            blurb="Trusted talks, articles and courses on speaking and listening, from other sites."
                        />
                        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {READING.map((r) => (
                                <a
                                    key={r.href}
                                    href={r.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${card} group block px-7 py-7 hover:-translate-y-0.5 ${focus}`}
                                >
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4A5568]">
                                        {r.format} · {r.source}
                                    </p>
                                    <h3 className={`${display} mt-2 flex items-start justify-between gap-3 text-xl font-bold text-[#14213D]`}>
                                        <span>
                                            {r.title}
                                            <span className="sr-only"> (opens in a new tab)</span>
                                        </span>
                                        <ArrowUpRight size={18} className="mt-1 shrink-0 text-[#1F7A8C]" aria-hidden="true" />
                                    </h3>
                                    <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568]">{r.note}</p>
                                </a>
                            ))}
                        </div>
                        <p className="mt-5 text-xs text-[#4A5568]">
                            Comskill is not affiliated with these sites. Links open in a new tab, and some sites may ask you to sign up.
                        </p>
                    </section>
                )}

                {/* Closing prompt, with the mascot */}
                <ResourcesCta />
            </div>
        </div>
    );
}