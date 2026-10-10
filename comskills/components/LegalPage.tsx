import type { ReactNode } from "react";

export type LegalSection = { id: string; heading: string; body: ReactNode };

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

type Props = {
    title: string;
    updated: string;
    intro: ReactNode;
    summary?: { heading: string; points: string[] };
    sections: LegalSection[];
};
export default function LegalPage({ title, updated, intro, summary, sections }: Props) {
    return (
        <div className="bg-[#FAF8F5]" style={{ background: "#FAF8F5" }}>
            <div className="mx-auto w-full max-w-[1280px] px-6 pb-24 pt-12 lg:px-10 xl:px-16">
                <header className="mx-auto max-w-[760px] text-center">
                    <h1 className={`${display} text-[clamp(36px,5.5vw,72px)] font-extrabold leading-[1.03] text-[#14213D]`}>
                        {title}
                    </h1>
                    <p className="mt-4 text-sm text-[#4A5568]">Last updated {updated}</p>
                    <div className="mt-5 text-base leading-relaxed text-[#4A5568] xl:text-lg">{intro}</div>
                </header>

                {summary && (
                    <aside className="mt-12 rounded-[28px] bg-[#EFEAE2] px-7 py-7 lg:px-10 lg:py-8">
                        <h2 className={`${display} text-lg font-bold text-[#14213D] xl:text-xl`}>{summary.heading}</h2>
                        <ul className="mt-4 grid list-disc gap-x-12 gap-y-2.5 pl-5 text-[15px] leading-relaxed text-[#14213D] md:grid-cols-2 xl:text-base">
                            {summary.points.map((p) => (
                                <li key={p}>{p}</li>
                            ))}
                        </ul>
                    </aside>
                )}

                <nav aria-label="On this page" className="mt-12">
                    <ol className="flex flex-wrap justify-center gap-2.5">
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    className={`inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14213D] shadow-sm hover:bg-[#EFEAE2] ${focus}`}
                                >
                                    {s.heading}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="mt-14 divide-y divide-[#14213D]/10 border-y border-[#14213D]/10">
                    {sections.map((s) => (
                        <section
                            key={s.id}
                            id={s.id}
                            aria-labelledby={`${s.id}-h`}
                            className="grid scroll-mt-28 gap-4 py-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-16 xl:py-12"
                        >
                            <h2
                                id={`${s.id}-h`}
                                className={`${display} text-2xl font-extrabold text-[#14213D] lg:sticky lg:top-28 lg:self-start xl:text-3xl`}
                            >
                                {s.heading}
                            </h2>
                            <div className="max-w-[760px] space-y-3 text-[15px] leading-relaxed text-[#4A5568] xl:text-base [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_strong]:text-[#14213D]">
                                {s.body}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}