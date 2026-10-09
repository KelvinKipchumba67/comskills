"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Same key the page checks. The page only opens for visitors who got there through this button.
export const TOUR_KEY = "comskill:tour";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F7A8C]";

export default function SeeHowItWorks() {
    return (
        <Link
            href="/how-it-works"
            prefetch={false}
            onClick={() => {
                try {
                    sessionStorage.setItem(TOUR_KEY, "1");
                } catch {
                    // Storage blocked: the page will send the visitor back home.
                }
            }}
            className={`group inline-flex items-center gap-3 font-[family-name:var(--font-sora)] text-xs font-bold uppercase tracking-[0.18em] text-[#14213D] ${focus}`}
        >
            See how it works
            <ArrowRight size={18} className="transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
        </Link>
    );
}