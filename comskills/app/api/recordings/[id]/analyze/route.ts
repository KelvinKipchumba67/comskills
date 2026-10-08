import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust to wherever you export your Prisma client
import { getUserId } from "@/lib/auth";
import { runAnalysis } from "@/lib/analysis/run";

export const maxDuration = 120; // seconds; analysis usually takes well under a minute

const STALE_MS = 5 * 60_000;

// While an analysis runs, "analyzedAt" holds the time it started, so a crashed run can be retried after 5 minutes.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const { id } = await params;

    const rec = await prisma.recording.findFirst({ where: { id, userId } });
    if (!rec || rec.status !== "READY") return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Already done: don't spend more credits on a repeat click
    if (rec.analysisStatus === "DONE") return NextResponse.json({ status: "DONE" });

    // Claim it. Only one run at a time per recording.
    const claimed = await prisma.recording.updateMany({
        where: {
            id,
            userId,
            OR: [{ analysisStatus: { not: "PROCESSING" } }, { analyzedAt: { lt: new Date(Date.now() - STALE_MS) } }],
        },
        data: { analysisStatus: "PROCESSING", analysisError: null, analyzedAt: new Date() },
    });
    if (claimed.count === 0) return NextResponse.json({ error: "Already analyzing" }, { status: 409 });

    await runAnalysis({ id: rec.id, path: rec.path });

    const after = await prisma.recording.findUnique({ where: { id }, select: { analysisStatus: true } });
    return NextResponse.json({ status: after?.analysisStatus });
}