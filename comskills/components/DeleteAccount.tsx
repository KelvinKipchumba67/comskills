"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/Client";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

type Props = {
    email: string;
    recordings: number;
    totalSize: string | null;
};

export default function DeleteAccount({ email, recordings, totalSize }: Props) {
    const [open, setOpen] = useState(false);
    const [typed, setTyped] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const phrase = email || "DELETE";
    const matches = typed.trim().toLowerCase() === phrase.toLowerCase();

    function cancel() {
        setOpen(false);
        setTyped("");
        setError(null);
    }

    async function confirmDelete() {
        if (!matches || busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/account/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirm: typed.trim() }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                setError(data.error ?? "We couldn't delete your account. Please try again.");
                setBusy(false);
                return;
            }
            await createClient()
                .auth.signOut({ scope: "local" })
                .catch(() => undefined);
            window.location.assign("/account-deleted");
        } catch {
            setError("Something went wrong. Check your connection and try again.");
            setBusy(false);
        }
    }

    if (!open) {
        return (
            <div>
                <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[#4A5568]">
                    Permanently delete your account and everything in it. This cannot be undone.
                </p>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={`mt-5 inline-flex h-11 items-center rounded-full border-2 border-[#B3361B] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-[#B3361B] hover:bg-[#B3361B] hover:text-white ${focus}`}
                >
                    Delete account
                </button>
            </div>
        );
    }

    return (
        <div className="mt-3">
            <p className="max-w-[58ch] text-[15px] leading-relaxed text-[#14213D]">
                <strong>This will permanently remove:</strong>
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-[#4A5568]">
                <li>
                    {recordings === 0
                        ? "Your saved recordings (you have none right now)"
                        : `Your ${recordings} ${recordings === 1 ? "recording" : "recordings"}${totalSize ? ` (${totalSize})` : ""}, including the video files`}
                </li>
                <li>Every transcript and analysis</li>
                <li>Your lesson progress</li>
                <li>Your sign in details</li>
            </ul>
            <p className="mt-4 max-w-[58ch] text-[15px] font-semibold leading-relaxed text-[#B3361B]">
                We cannot recover any of this afterwards.
            </p>

            <label htmlFor="confirm-delete" className="mt-6 block text-[13px] font-medium text-[#14213D]">
                {email ? (
                    <>
                        To confirm, type your email address: <span className="font-semibold">{email}</span>
                    </>
                ) : (
                    <>
                        To confirm, type <span className="font-semibold">DELETE</span>
                    </>
                )}
            </label>
            <input
                id="confirm-delete"
                type="text"
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                disabled={busy}
                className="mt-2 w-full max-w-[420px] rounded-lg border border-[#8A94A6]/40 bg-white px-4 py-3 text-[15px] text-[#14213D] focus:border-[#1F7A8C] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30 disabled:opacity-60"
            />

            {error && (
                <div
                    role="alert"
                    className="mt-4 max-w-[560px] rounded-lg border border-[#F5A524] bg-[#FDF0D5] px-4 py-3 text-sm font-medium"
                    style={{ color: "#6B4200" }}
                >
                    {error}
                </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={confirmDelete}
                    disabled={!matches || busy}
                    className={`inline-flex h-11 items-center rounded-full bg-[#B3361B] px-6 text-xs font-extrabold uppercase tracking-[0.14em] text-white hover:bg-[#992d16] disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
                >
                    {busy ? "Deleting..." : "Delete my account"}
                </button>
                <button
                    type="button"
                    onClick={cancel}
                    disabled={busy}
                    className={`text-sm font-semibold text-[#14213D] underline underline-offset-4 disabled:opacity-50 ${focus}`}
                >
                    Cancel
                </button>
            </div>
            {busy && (
                <p role="status" className="mt-3 text-sm text-[#4A5568]">
                    Deleting your data. This can take a moment if you have many recordings.
                </p>
            )}
        </div>
    );
}