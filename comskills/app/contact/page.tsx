import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/Server";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Contact | Comskill",
    description: "Send the Comskill team a question, a problem report, or a request about your account.",
};

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";

const TIPS = [
    {
        title: "Something isn't working",
        body: "Tell us what you did, what you expected, and what happened instead. The name of the page helps.",
    },
    {
        title: "Account or privacy request",
        body: "To delete your account or ask what we hold about you, choose this topic and say what you need.",
    },
    {
        title: "Feedback or an idea",
        body: "Tell us what would make practice more useful for you. We read everything.",
    },
];

export default async function ContactPage() {
    let name = "";
    let email = "";
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
        name = (meta.full_name || meta.name || "").trim();
        email = user?.email ?? "";
    } catch {
    }

    return (
        <div className="bg-[#FAF8F5]" style={{ background: "#FAF8F5" }}>
            <div className="grid w-full gap-12 px-6 pb-24 pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-10 xl:px-16">
                <div>
                    <h1 className={`${display} text-[clamp(34px,5vw,64px)] font-extrabold leading-[1.05] text-[#14213D]`}>
                        Contact us
                    </h1>
                    <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#4A5568] xl:text-lg">
                        Have a question, found a problem, or want to ask about your account? Send us a message and we&apos;ll reply
                        by email.
                    </p>

                    <ul className="mt-10 grid max-w-[520px] gap-6">
                        {TIPS.map((t) => (
                            <li key={t.title}>
                                <h2 className={`${display} text-base font-bold text-[#14213D]`}>{t.title}</h2>
                                <p className="mt-1 text-sm leading-relaxed text-[#4A5568]">{t.body}</p>
                            </li>
                        ))}
                    </ul>

                    {LEGAL.email && (
                        <p className="mt-10 text-sm text-[#4A5568]">
                            Prefer email? Write to{" "}
                            <a
                                href={`mailto:${LEGAL.email}`}
                                className="font-semibold text-[#1F7A8C] underline underline-offset-4"
                            >
                                {LEGAL.email}
                            </a>
                            .
                        </p>
                    )}
                </div>

                <div className="rounded-[28px] bg-white px-6 py-8 shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)] sm:px-9 sm:py-10">
                    <ContactForm defaultName={name} defaultEmail={email} />
                </div>
            </div>
        </div>
    );
}