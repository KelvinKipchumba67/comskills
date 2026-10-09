import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { runAnalysis, rerunCoach } from "@/lib/analysis/run";

export const maxDuration = 120;

const STALE_MS = 3 * 60_000;

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const { id } = await params;
    const query = new URL(req.url).searchParams;

    const rec = await prisma.recording.findFirst({ where: { id, userId } });
    if (!rec || rec.status !== "READY") return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (query.get("only") === "coach") {
        if (rec.analysisStatus !== "DONE") return NextResponse.json({ error: "Analyze the recording first" }, { status: 409 });
        await rerunCoach(rec);
        return NextResponse.json({ status: "DONE" });
    }

    if (rec.analysisStatus === "DONE" && query.get("force") !== "1") return NextResponse.json({ status: "DONE" });
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