import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account deleted | Comskill", robots: { index: false, follow: false } };

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

export default function AccountDeletedPage() {
    return (
        <div className="bg-[#FAF8F5]" style={{ background: "#FAF8F5", minHeight: "60vh" }}>
            <div className="mx-auto max-w-[620px] px-6 py-20 text-center">
                <h1 className={`${display} text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.05] text-[#14213D]`}>
                    Your account has been deleted
                </h1>
                <p className="mt-5 text-base leading-relaxed text-[#4A5568]">
                    Your recordings, analysis, progress and sign in details have been removed. Thank you for practicing with
                    Comskill. You are always welcome back.
                </p>
                <Link
                    href="/"
                    className={`mt-8 inline-flex h-[52px] items-center rounded-full bg-[#14213D] px-[30px] font-[family-name:var(--font-sora)] text-xs font-extrabold uppercase tracking-[0.14em] text-white hover:bg-[#1d2f55] ${focus}`}
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}