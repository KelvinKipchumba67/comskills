"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const input =
    "w-full rounded-lg border border-[#8A94A6]/40 bg-white px-4 py-3 text-[15px] text-[#14213D] placeholder-[#8A94A6] transition-all focus:border-[#1F7A8C] focus:outline-none focus:ring-2 focus:ring-[#1F7A8C]/30";
const labelCls = "block text-[13px] font-medium text-[#14213D]";

const TOPICS = [
    { value: "general", label: "General question" },
    { value: "problem", label: "Something isn't working" },
    { value: "privacy", label: "Account or privacy request" },
    { value: "feedback", label: "Feedback or idea" },
];

const MAX = 2000;

export default function ContactForm({ defaultName = "", defaultEmail = "" }: { defaultName?: string; defaultEmail?: string }) {
    const [name, setName] = useState(defaultName);
    const [email, setEmail] = useState(defaultEmail);
    const [topic, setTopic] = useState("general");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState(""); // hidden trap field for bots
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (sending) return;
        setError(null);
        setSending(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, topic, message, website }),
            });
            const data = (await res.json().catch(() => ({}))) as { error?: string };
            if (!res.ok) {
                setError(data.error ?? "We couldn't send your message. Please try again.");
                return;
            }
            setSent(true);
        } catch {
            setError("Something went wrong. Check your connection and try again.");
        } finally {
            setSending(false);
        }
    }

    if (sent) {
        return (
            <div role="status" className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#2FA66A] text-white">
                    <Check size={28} strokeWidth={3} aria-hidden="true" />
                </span>
                <h2 className={`${display} mt-5 text-2xl font-extrabold text-[#14213D]`}>Message sent</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#4A5568]">
                    Thank you. We&apos;ll reply to {email} as soon as we can.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSent(false);
                        setMessage("");
                    }}
                    className="mt-6 text-sm font-semibold text-[#1F7A8C] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-5 font-inter">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="c-name" className={labelCls}>
                        Name
                    </label>
                    <input
                        id="c-name"
                        type="text"
                        autoComplete="name"
                        required
                        maxLength={100}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={input}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="c-email" className={labelCls}>
                        E-mail
                    </label>
                    <input
                        id="c-email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={200}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={input}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="c-topic" className={labelCls}>
                    What is this about?
                </label>
                <select id="c-topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={input}>
                    {TOPICS.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="c-message" className={labelCls}>
                    Message
                </label>
                <textarea
                    id="c-message"
                    required
                    minLength={10}
                    maxLength={MAX}
                    rows={7}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${input} resize-y`}
                />
                <p className="text-right text-xs text-[#4A5568]">
                    {message.length} / {MAX}
                </p>
            </div>

            {/* Bots fill every field. People never see this one. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                <label htmlFor="c-website">Leave this empty</label>
                <input
                    id="c-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-[#F5A524] bg-[#FDF0D5] px-4 py-3 text-sm font-medium"
                    style={{ color: "#6B4200" }}
                >
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={sending}
                className="inline-flex h-[52px] items-center rounded-full bg-[#14213D] px-[30px] font-[family-name:var(--font-sora)] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]"
            >
                {sending ? "Sending…" : "Send message"}
            </button>
        </form>
    );
}