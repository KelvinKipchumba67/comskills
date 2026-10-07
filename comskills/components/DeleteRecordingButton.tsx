"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

export default function DeleteRecordingButton({ id, redirectTo }: { id: string; redirectTo?: string }) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(false);

    async function remove() {
        setBusy(true);
        setError(false);
        try {
            const res = await fetch(`/api/recordings/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            if (redirectTo) router.push(redirectTo);
            else router.refresh();
        } catch {
            setError(true);
            setBusy(false);
            setConfirming(false);
        }
    }

    if (!confirming) {
        return (
            <div className="flex items-center gap-3">
                {error && <span role="alert" className="text-xs font-semibold text-[#B3361B]">Couldn&apos;t delete. Try again.</span>}
                <button
                    onClick={() => setConfirming(true)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-[#4A5568] hover:bg-[#EFEAE2] hover:text-[#B3361B] ${focus}`}
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#4A5568]">Delete for good?</span>
            <button
                onClick={remove}
                disabled={busy}
                className={`rounded-full bg-[#B3361B] px-4 py-1.5 text-xs font-bold text-white hover:brightness-110 disabled:opacity-60 ${focus}`}
            >
                {busy ? "Deleting..." : "Yes, delete"}
            </button>
            <button
                onClick={() => setConfirming(false)}
                disabled={busy}
                className={`rounded-full px-3 py-1.5 text-xs font-bold text-[#14213D] hover:bg-[#EFEAE2] ${focus}`}
            >
                Cancel
            </button>
        </div>
    );
}