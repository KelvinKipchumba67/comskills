"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/logo";
import AuthButton from "@/components/AuthButton";

const LINKS = [
    { href: "/", label: "Home" },
    { href: "/practice", label: "Practice" },
    { href: "/about", label: "About" },
];
const MOBILE_LINKS = [
    { href: "/", label: "Home" },
    { href: "/practice", label: "Practice" },
    { href: "/dashboard", label: "Analytics" },
    { href: "/learning", label: "My learning" },
    { href: "/about", label: "About" },
];

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F7A8C]";
const label = "font-sora text-xs font-bold uppercase tracking-[0.18em]";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    // Close the menu after any navigation.
    useEffect(() => setOpen(false), [pathname]);

    const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

    return (
        <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]">
            <div className="flex w-full items-center justify-between px-6 py-5 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-10 xl:px-16">
                <Link href="/" aria-label="Comskill home" className={`block min-w-0 justify-self-start max-[360px]:[&_p]:text-[8px] max-[360px]:[&_p]:tracking-normal ${focus}`}>
                    <Logo />
                </Link>

                {/* Desktop links */}
                <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
                    {LINKS.map(({ href, label: text }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-current={isActive(href) ? "page" : undefined}
                            className={`${label} border-b-2 py-1 text-[#14213D] ${focus} ${
                                isActive(href) ? "border-[#1F7A8C]" : "border-transparent hover:border-[#14213D]/30"
                            }`}
                        >
                            {text}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3 justify-self-end">
                    <AuthButton />
                    <button
                        type="button"
                        aria-label="Language: English"
                        className={`${label} hidden rounded-full bg-white px-3.5 py-2.5 text-[11px] text-[#14213D] md:inline-flex ${focus}`}
                    >
                        EN
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "Close menu" : "Open menu"}
                        className={`grid h-10 w-10 place-items-center rounded-full bg-white text-[#14213D] md:hidden ${focus}`}
                    >
                        {open ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div id="mobile-menu" className="px-6 pb-6 md:hidden">
                    <nav
                        aria-label="Mobile"
                        className="flex max-h-[calc(100vh-110px)] flex-col gap-1 overflow-y-auto rounded-3xl bg-white p-3 shadow-[0_20px_50px_-22px_rgba(20,33,61,0.25)]"
                    >
                        {MOBILE_LINKS.map(({ href, label: text }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                aria-current={isActive(href) ? "page" : undefined}
                                className={`${label} rounded-full px-5 py-3 ${focus} ${
                                    isActive(href) ? "bg-[#14213D] text-white" : "text-[#14213D] hover:bg-[#EFEAE2]"
                                }`}
                            >
                                {text}
                            </Link>
                        ))}
                        <AuthButton variant="mobile" onNavigate={() => setOpen(false)} />
                    </nav>
                </div>
            )}
        </header>
    );
}