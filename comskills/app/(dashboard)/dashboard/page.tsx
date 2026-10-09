import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import type { AnalysisResult } from "@/lib/analysis/types";
import AnalyticsView from "@/components/AnalyticsView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
    const userId = await getUserId();
    if (!userId) redirect("/signup");

    const rows = await prisma.recording.findMany({
        where: { userId, status: "READY" },
        select: { createdAt: true, seconds: true, analysisStatus: true, analysis: true },
        orderBy: { createdAt: "asc" },
    });

    const sessions = rows.map((r) => {
        const a = r.analysisStatus === "DONE" ? (r.analysis as AnalysisResult | null) : null;
        const mt = a?.metrics;
        // Only sessions with enough speech give trustworthy numbers.
        const usable = !!mt && mt.enoughSpeech && mt.durationSec > 0;
        return {
            at: r.createdAt.toISOString(),
            seconds: r.seconds,
            m: usable
                ? {
                    wpm: mt.wpm,
                    steadiness: mt.paceSteadiness,
                    fillersPerMin: mt.fillers.perMinute,
                    longPauses: mt.longPauses.length,
                    durationSec: mt.durationSec,
                    improve: a!.insights.filter((i) => i.kind === "improve").map((i) => i.title),
                }
                : null,
        };
    });

    const notAnalyzed = sessions.filter((s) => s.m === null).length;

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className="font-[family-name:var(--font-sora)] text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                    Analytics
                </h1>
            </div>
            <AnalyticsView sessions={sessions} notAnalyzed={notAnalyzed} />
        </div>
    );
}