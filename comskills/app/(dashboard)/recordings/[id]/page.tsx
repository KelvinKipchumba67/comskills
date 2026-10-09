import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { supabaseAdmin, RECORDINGS_BUCKET } from "@/lib/supabaseAdmin";
import { formatDuration, formatSize } from "@/lib/format";
import type { AnalysisResult } from "@/lib/analysis/types";
import LocalTime from "@/components/LocalTime";
import DeleteRecordingButton from "@/components/DeleteRecordingButton";
import RecordingWorkspace from "@/components/RecordingWorkspace";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

export default async function RecordingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getUserId();
    if (!userId) redirect("/auth");

    const rec = await prisma.recording.findFirst({ where: { id, userId } });
    if (!rec || rec.status !== "READY") notFound();

    // The bucket is private, so playback uses a link that expires after an hour.
    const { data } = await supabaseAdmin.storage.from(RECORDINGS_BUCKET).createSignedUrl(rec.path, 3600);

    const meta = [
        { label: "Length", value: formatDuration(rec.seconds) },
        { label: "Size", value: formatSize(rec.sizeBytes) },
        { label: "Recorded", value: <LocalTime iso={rec.createdAt.toISOString()} /> },
    ];

    return (
        <div className="mx-auto max-w-[880px]">
            <Link href="/recordings" className={`mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5568] hover:text-[#14213D] ${focus}`}>
                <ArrowLeft size={16} /> My recordings
            </Link>

            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>Practice session</h1>
                <DeleteRecordingButton id={rec.id} redirectTo="/recordings" />
            </div>

            <RecordingWorkspace
                id={rec.id}
                videoUrl={data?.signedUrl ?? null}
                status={rec.analysisStatus}
                error={rec.analysisError}
                analysis={(rec.analysis as AnalysisResult | null) ?? null}
                transcript={rec.transcript}
                startedAt={rec.analyzedAt ? rec.analyzedAt.toISOString() : null}
            >
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                    {meta.map((m) => (
                        <div key={m.label} className={`${card} px-5 py-4`}>
                            <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4A5568]">{m.label}</dt>
                            <dd className={`${display} mt-1 text-lg font-bold`}>{m.value}</dd>
                        </div>
                    ))}
                </dl>
            </RecordingWorkspace>
        </div>
    );
}