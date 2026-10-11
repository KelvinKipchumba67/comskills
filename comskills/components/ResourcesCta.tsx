"use client";

import Link from "next/link";
import Mascot from "@/components/Mascot";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
export default function ResourcesCta() {
    return (
        <section className="mt-20 overflow-hidden rounded-[28px] bg-[#EFEAE2] px-8 py-10 lg:px-12 xl:mt-24">
            <style>{`
                @keyframes comsky-hop {
                    0%, 52%, 100% { transform: translateY(0) rotate(0deg) scale(1, 1); }
                    58%           { transform: translateY(0) rotate(0deg) scale(1.06, 0.92); }
                    70%           { transform: translateY(-26px) rotate(-5deg) scale(0.97, 1.05); }
                    80%           { transform: translateY(0) rotate(0deg) scale(1.05, 0.94); }
                    86%           { transform: translateY(-9px) rotate(3deg) scale(1, 1); }
                    92%           { transform: translateY(0) rotate(0deg) scale(1.02, 0.98); }
                }
                .comsky-hop { transform-origin: 50% 100%; }
                @media (prefers-reduced-motion: no-preference) {
                    .comsky-hop { animation: comsky-hop 3.6s ease-in-out infinite; }
                }
            `}</style>

            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left lg:gap-12">
                <div className="comsky-hop shrink-0 pt-6">
                    <Mascot mood="happy" size={200} title="comsky, the Comskill mascot" />
                </div>

                <div className="flex-1">
                    <h2 className={`${display} text-2xl font-extrabold text-[#14213D] xl:text-4xl`}>Ready to try a tip?</h2>
                    <p className="mx-auto mt-2 max-w-[48ch] text-[15px] leading-relaxed text-[#4A5568] md:mx-0 xl:text-base">
                        Pick one idea from this page, record a short take, and see what changes in your feedback.
                    </p>
                </div>

                <Link
                    href="/practice"
                    className={`inline-flex h-[52px] shrink-0 items-center rounded-full bg-[#14213D] px-[30px] font-[family-name:var(--font-sora)] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_-10px_rgba(20,33,61,0.55)] hover:bg-[#1d2f55] ${focus}`}
                >
                    Start practicing
                </Link>
            </div>
        </section>
    );
}