"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/Client";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F7A8C]";
const label = "font-sora text-xs font-bold uppercase tracking-[0.18em]";
const pill = `${label} inline-flex items-center rounded-full bg-[#14213D] px-6 py-3 text-white shadow-[0_0_0_4px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] ${focus}`;
const menuItem =
    "block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#14213D] hover:bg-[#EFEAE2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F7A8C]";
// Set inline so the spacing and left alignment can't be overridden by other styles.
const itemStyle: CSSProperties = { display: "block", width: "100%", textAlign: "left", padding: "10px 14px" };
const mobileItem = `${label} block w-full rounded-full px-5 py-3 text-left text-[#14213D] hover:bg-[#EFEAE2] ${focus}`;

function firstName(user: User): string {
    const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
    const full = (meta.full_name || meta.name || "").trim();
    if (full) return full.split(/\s+/)[0];
    return user.email ? user.email.split("@")[0] : "there";
}

type Props = {
    variant?: "desktop" | "mobile";
    onNavigate?: () => void;
};

export default function AuthButton({ variant = "desktop", onNavigate }: Props) {
    const router = useRouter();
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
        return () => sub.subscription.unsubscribe();
    }, []);

    // Close the desktop menu on outside click or Escape.
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    async function signOut() {
        setOpen(false);
        onNavigate?.();
        await createClient().auth.signOut();
        router.push("/");
        router.refresh();
    }

    const mobile = variant === "mobile";
    if (user === undefined) {
        return mobile ? null : <span aria-hidden className="hidden h-10 w-[120px] md:inline-block" />;
    }

    if (user === null) {
        return mobile ? (
            <Link
                href="/auth?mode=signup"
                onClick={onNavigate}
                className={`${label} mt-2 block rounded-full bg-[#14213D] px-5 py-3.5 text-center text-white ${focus}`}
            >
                Sign up
            </Link>
        ) : (
            <Link href="/auth?mode=signup" className={`${pill} hidden md:inline-flex`}>
                Sign up
            </Link>
        );
    }

    const greeting = `Happy Practice, ${firstName(user)}`;

    if (mobile) {
        return (
            <div className="mt-2 grid gap-1">
                <p className={`${label} truncate rounded-full bg-[#14213D] px-5 py-3.5 text-center text-white`}>{greeting}</p>
                <button type="button" onClick={signOut} className={mobileItem} style={itemStyle}>
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <div ref={box} className="relative hidden md:block">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                className={pill}
            >
                <span className="max-w-[150px] truncate tracking-[0.1em] min-[900px]:max-w-[230px] lg:max-w-[260px] lg:tracking-[0.18em]">{greeting}</span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-3 w-52 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-22px_rgba(20,33,61,0.35)]"
                >
                    <Link role="menuitem" href="/practice" onClick={() => setOpen(false)} className={menuItem} style={itemStyle}>
                        Practice
                    </Link>
                    <Link role="menuitem" href="/recordings" onClick={() => setOpen(false)} className={menuItem} style={itemStyle}>
                        My recordings
                    </Link>
                    <button role="menuitem" type="button" onClick={signOut} className={menuItem} style={itemStyle}>
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}