import Link from "next/link";
import Logo from "@/components/logo";
const CREDIT = {
    name: "Kelvin Kipchumba",
    portfolio: "https://kelvinkipchumba.dev",
    github: "https://github.com/KelvinKipchumba67",
    linkedin: "https://www.linkedin.com/in/kelvin-kipchumba67",
};

const CREDIT_LINKS = [
    { label: "Portfolio", href: CREDIT.portfolio },
    { label: "GitHub", href: CREDIT.github },
    { label: "LinkedIn", href: CREDIT.linkedin },
].filter((l) => l.href);

const COLUMNS = [
    {
        title: "Product",
        links: [
            { href: "/practice", label: "Practice" },
            { href: "/recordings", label: "My recordings" },
            { href: "/learning", label: "My learning" },
            { href: "/dashboard", label: "Analytics" },
        ],
    },
    {
        title: "Company",
        links: [
            { href: "/about", label: "About" },
        ],
    },
    {
        title: "Legal",
        links: [
            { href: "/privacy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
        ],
    },
];

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F7A8C]";

export default function Footer() {
    return (
        <footer className="border-t border-[#14213D]/10 bg-[#FAF8F5] text-[#14213D]">
            <div className="w-full px-6 py-14 lg:px-10 xl:px-16">
                <div className="flex flex-col gap-12 md:flex-row md:justify-between">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <Link href="/" aria-label="Comskill home" className={`block ${focus}`}>
                            <Logo />
                        </Link>
                        <p className="mt-5 font-inter text-sm leading-relaxed text-[#4A5568]">
                            Your personal AI speech coach. Practice out loud, get clear feedback, and speak with confidence.
                        </p>
                    </div>

                    {/* Link columns */}
                    <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
                        {COLUMNS.map((col) => (
                            <div key={col.title}>
                                <h2 className="font-sora text-[11px] font-bold uppercase tracking-[0.18em]">{col.title}</h2>
                                <ul className="mt-4 flex flex-col gap-3">
                                    {col.links.map((l) => (
                                        <li key={l.href}>
                                            <Link
                                                href={l.href}
                                                className={`font-inter text-sm text-[#4A5568] hover:text-[#14213D] ${focus}`}
                                            >
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-12 flex flex-col gap-4 border-t border-[#14213D]/10 pt-6 font-inter text-xs text-[#4A5568] sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1.5">
                        <p>&copy; {new Date().getFullYear()} Comskill. All rights reserved.</p>
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                                Designed and built by{" "}
                                <span className="font-semibold text-[#14213D]">{CREDIT.name}</span>
                            </span>
                            {CREDIT_LINKS.map((l) => (
                                <a
                                    key={l.label}
                                    href={l.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-semibold text-[#1F7A8C] underline underline-offset-4 hover:text-[#14213D] ${focus}`}
                                >
                                    {l.label}
                                </a>
                            ))}
                        </p>
                    </div>
                    <p className="font-sora font-bold uppercase tracking-[0.18em] text-[#FF7A59]">
                        Changing lives one practice at a time
                    </p>
                </div>
            </div>
        </footer>
    );
}