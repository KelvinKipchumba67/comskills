"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Video, Home, LayoutDashboard, Film, BookOpen,
    ChevronLeft, ChevronRight, Mic, MessageSquare,
} from "lucide-react";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

const NAV = [
    { href: "/#home", label: "Home", icon: Home },
    { href: "/practice", label: "Practice", icon: Video },
    { href: "/dashboard", label: "Analytics", icon: LayoutDashboard },
    { href: "/recordings", label: "My recordings", icon: Film },
    { href: "/learning", label: "My learning", icon: BookOpen },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={`hidden shrink-0 flex-col px-4 py-5 transition-[width] duration-200 motion-reduce:transition-none md:flex ${
                collapsed ? "w-[84px]" : "w-[232px]"
            }`}
        >
            <div
                className={`flex px-2 ${
                    collapsed ? "flex-col items-center gap-4 pb-5" : "items-start justify-between gap-2 pb-7"
                }`}
            >
                <button
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#4A5568] hover:bg-[#EFEAE2] ${focus}`}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            title={collapsed ? label : undefined}
                            aria-current={active ? "page" : undefined}
                            className={`flex items-center gap-3 rounded-full py-[11px] text-sm font-semibold ${focus} ${
                                collapsed ? "justify-center px-3" : "px-4"
                            } ${
                                active
                                    ? "bg-[#14213D] text-white"
                                    : "text-[#4A5568] hover:bg-[#EFEAE2] hover:text-[#14213D]"
                            }`}
                        >
                            <Icon size={18} />
                            {!collapsed && label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}