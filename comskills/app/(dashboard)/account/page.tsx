import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/Server";
import { prisma } from "@/lib/prisma";
import { formatSize } from "@/lib/format";
import DeleteAccount from "@/components/DeleteAccount";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";

const METHODS: Record<string, string> = {
    email: "Email and password",
    google: "Google",
    facebook: "Facebook",
};

export default async function AccountPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/auth?mode=signup");

    const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string };
    const name = (meta.full_name || meta.name || "").trim();
    const method = METHODS[String(user.app_metadata?.provider ?? "email")] ?? "Email and password";

    // A summary of what deleting would remove, shown so the person knows what they are agreeing to.
    const [recordings, size] = await Promise.all([
        prisma.recording.count({ where: { userId: user.id } }),
        prisma.recording.aggregate({ where: { userId: user.id }, _sum: { sizeBytes: true } }),
    ]);

    const details = [
        { label: "Name", value: name || "Not set" },
        { label: "Email", value: user.email ?? "Not set" },
        { label: "Sign in method", value: method },
    ];

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>Account</h1>
            </div>

            <section aria-labelledby="details-h" className={`${card} px-7 py-7`}>
                <h2 id="details-h" className={`${display} text-lg font-bold text-[#14213D]`}>
                    Your details
                </h2>
                <dl className="mt-5 grid gap-5 sm:grid-cols-3">
                    {details.map((d) => (
                        <div key={d.label}>
                            <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A5568]">{d.label}</dt>
                            <dd className="mt-1 break-words text-[15px] font-semibold text-[#14213D]">{d.value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section aria-labelledby="delete-h" className={`${card} mt-6 px-7 py-7`}>
                <h2 id="delete-h" className={`${display} text-lg font-bold text-[#14213D]`}>
                    Delete account
                </h2>
                <DeleteAccount
                    email={user.email ?? ""}
                    recordings={recordings}
                    totalSize={size._sum.sizeBytes ? formatSize(size._sum.sizeBytes) : null}
                />
            </section>
        </div>
    );
}