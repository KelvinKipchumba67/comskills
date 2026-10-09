import { prisma } from "@/lib/prisma";
import { supabaseAdmin, RECORDINGS_BUCKET } from "@/lib/supabaseAdmin";
import { transcribeFromUrl, deleteTranscript } from "./transcribe";
import { computeMetrics } from "./metrics";
import { buildInsights } from "./insights";
import { coachFeedback } from "./coach";
import type { AnalysisResult } from "./types";

export async function runAnalysis(rec: { id: string; path: string }) {
    try {
        const { data, error } = await supabaseAdmin.storage.from(RECORDINGS_BUCKET).createSignedUrl(rec.path, 900);
        if (error || !data) throw new Error("Could not read the recording");

        const t = await transcribeFromUrl(data.signedUrl);
        const metrics = computeMetrics(t.words);
        const insights = buildInsights(metrics);
        const coached = metrics.enoughSpeech ? await coachFeedback(t.text, metrics, insights) : null;

        const result: AnalysisResult = {
            version: 1,
            metrics,
            insights,
            coach: coached?.ok ? coached.coach : null,
            coachModel: coached?.ok ? coached.model : null,
            coachError: coached && !coached.ok ? coached.error : null,
        };

        await prisma.recording.update({
            where: { id: rec.id },
            data: {
                analysisStatus: "DONE",
                transcript: t.text,
                analysis: JSON.parse(JSON.stringify(result)),
                analysisError: null,
                analyzedAt: new Date(),
            },
        });
        await deleteTranscript(t.id);
    } catch (e) {
        console.error("analysis failed:", e instanceof Error ? e.message : "unknown");
        await prisma.recording.update({
            where: { id: rec.id },
            data: { analysisStatus: "FAILED", analysisError: "We couldn't analyze this recording. Please try again." },
        });
    }
}

export async function rerunCoach(rec: { id: string; transcript: string | null; analysis: unknown }) {
    const a = rec.analysis as AnalysisResult | null;
    if (!a || !rec.transcript) return;

    const coached = await coachFeedback(rec.transcript, a.metrics, a.insights);
    const next: AnalysisResult = {
        ...a,
        coach: coached.ok ? coached.coach : a.coach,
        coachModel: coached.ok ? coached.model : a.coachModel,
        coachError: coached.ok ? null : coached.error,
    };
    await prisma.recording.update({ where: { id: rec.id }, data: { analysis: JSON.parse(JSON.stringify(next)) } });
}