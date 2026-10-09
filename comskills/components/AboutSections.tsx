import Link from "next/link";
import { Mic, BarChart2, ShieldCheck, ArrowRight } from "lucide-react";
import Mascot from "@/components/Mascot";

const MASCOT_NAME = "comsky";

const STEPS = [
    {
        icon: Mic,
        title: "Record out loud",
        body: "Rehearse a pitch, an interview answer or a presentation. Reading silently can't prepare you to speak.",
    },
    {
        icon: BarChart2,
        title: "Know how you sound",
        body: "Watch your take back and track your practice over time. Pace, filler word and clarity feedback is coming soon.",
    },
    {
        icon: ShieldCheck,
        title: "Keep only what you choose",
        body: "Your video stays on your device until you press save. Discard it and it's gone for good.",
    },
];

const btn =
    "font-sora text-[11px] font-bold uppercase tracking-[0.15em] bg-[#14213D] hover:bg-[#1d2f57] text-white px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

export default function AboutSections() {
    return (
        <div className="w-full bg-[#FAF8F5] font-inter text-[#14213D]">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700;800;900&display=swap');
        .font-sora { font-family: 'Sora', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
      `,
                }}
            />

            {/* Hero: mascot on the left, the three steps on the right */}
            <section className="grid w-full items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-24 lg:pt-16 xl:px-16">
                {/* Mascot */}
                <div className="relative mx-auto flex w-full max-w-[460px] flex-col items-center gap-5 pb-4 md:h-[420px] md:flex-row md:items-end md:justify-center md:gap-0 md:pb-0">
                    <div className="absolute bottom-2 left-6 right-6 h-[130px] -rotate-[5deg] skew-x-[-20deg] rounded-3xl border border-white bg-[#EFEAE2] opacity-80 shadow-xl" />
                    <div className="relative z-10 w-full max-w-[300px] rounded-2xl bg-white p-4 shadow-xl md:absolute md:left-0 md:top-4 md:w-auto md:max-w-[200px]">
                        <p className="font-sora text-sm font-bold">Hi, I&apos;m {MASCOT_NAME}</p>
                        <p className="mt-1 text-xs text-[#4A5568]">Welcome, comskills is a platform to practice communicating, learn and improve on communication skills. Let&apos;s warm up your voice.</p>
                        <span aria-hidden="true" className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-white" />
                    </div>
                    <Mascot mood="talking" size={270} title={`${MASCOT_NAME}, the Comskill mascot`} className="relative z-20 mb-4" />
                </div>

                {/* Steps */}
                <div id="how" className="mx-auto w-full max-w-xl scroll-mt-24">
                    <h2 className="font-sora text-[clamp(24px,2.6vw,34px)] font-extrabold leading-[1.1] tracking-[-0.03em]">
                        Practice that fits your day
                    </h2>
                    <ul className="mt-6 divide-y divide-[#EFEAE2] rounded-[28px] bg-white px-7 shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]">
                        {STEPS.map(({ icon: Icon, title, body }) => (
                            <li key={title} className="flex items-start gap-5 py-6">
                                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#14213D] text-white shadow-lg">
                                    <Icon size={22} />
                                </span>
                                <div>
                                    <h3 className="font-sora text-lg font-bold tracking-[-0.02em]">{title}</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Middle band: headline, intro and actions */}
            <section className="w-full bg-white px-6 py-20 lg:px-10 lg:py-28 xl:px-16">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <h1 className="mt-4 font-sora text-[clamp(30px,4.5vw,68px)]">
                            Speaking well is a skill. Skills grow with practice.
                        </h1>
                    </div>
                    <div>
                        <p className="text-[15px] leading-relaxed text-[#4A5568]"></p>
                        <div className="mt-8 flex flex-wrap items-center gap-6">
                            {/* the two links, unchanged */}
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing call to action */}
            <section className="w-full bg-[#EFEAE2] px-6 py-20 lg:px-10 lg:py-28 xl:px-16">
                <div className="grid items-center gap-10 md:grid-cols-[auto_1fr_auto] md:gap-14 lg:gap-20">
                    <Mascot
                        mood="happy"
                        size={320}
                        title={`${MASCOT_NAME} smiling`}
                        className="mx-auto shrink-0"
                    />

                    <div className="text-center md:text-left">
                        <h2 className="font-sora text-[clamp(32px,4.5vw,64px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                            Ready to find your voice?
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4A5568] md:text-lg">
                            Create an account and record your first session in minutes. {MASCOT_NAME} will be waiting.
                        </p>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <Link href="/auth" className={`${btn} px-10 py-5`}>Get started</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}