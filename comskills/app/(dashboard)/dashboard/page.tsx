import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import AnalyticsView from "@/components/AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const userId = await getUserId();
    if (!userId) redirect("/signup");

    const rows = await prisma.recording.findMany({
        where: { userId, status: "READY" },
        select: { createdAt: true, seconds: true },
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className="font-[family-name:var(--font-sora)] text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                    Analytics
                </h1>
            </div>
            <AnalyticsView sessions={rows.map((r) => ({ at: r.createdAt.toISOString(), seconds: r.seconds }))} />
        </div>
    );
}