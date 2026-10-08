"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const btn =
    "inline-flex h-[52px] items-center gap-2.5 rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] disabled:cursor-progress disabled:opacity-60";

export default function MarkCompleteButton({ slug, completed }: { slug: string; completed: boolean }) {
    const router = useRouter();
    const [done, setDone] = useState(completed);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(false);

    async function toggle() {
        setBusy(true);
        setError(false);
        try {
            const res = await fetch(`/api/learning/${slug}`, { method: done ? "DELETE" : "PUT" });
            if (!res.ok) throw new Error();
            setDone(!done);
            router.refresh();
        } catch {
            setError(true);
        }
        setBusy(false);
    }

    return (
        <div>
            <button
                onClick={toggle}
                disabled={busy}
                className={
                    done
                        ? `inline-flex h-[52px] items-center gap-2 rounded-full bg-[#2FA66A]/10 px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1d7a4d] disabled:opacity-60 ${focus}`
                        : `${btn} ${focus}`
                }
            >
                {done ? <><Check size={16} /> Completed &middot; Undo</> : "Mark as complete"}
            </button>
            {error && <p role="alert" className="mt-2 text-sm font-semibold text-[#B3361B]">Couldn&apos;t save that. Try again.</p>}
        </div>
    );
}