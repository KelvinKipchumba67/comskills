import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { formatDuration, formatSize } from "@/lib/format";
import LocalTime from "@/components/LocalTime";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

const statusLabel: Record<string, string> = {
    DONE: "Analyzed",
    PROCESSING: "Analyzing",
    FAILED: "Analysis failed",
};

export default async function RecordingsPage() {
    const userId = await getUserId();
    if (!userId) redirect("/auth");

    // Newest first, and only recordings whose upload finished.
    const recordings = await prisma.recording.findMany({
        where: { userId, status: "READY" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>My recordings</h1>
                <Link
                    href="/practice"
                    className={`rounded-full bg-[#FF7A59] px-5 py-2.5 text-sm font-bold text-[#14213D] ${focus}`}
                >
                    New recording
                </Link>
            </div>

            {recordings.length === 0 ? (
                <div className={`${card} px-6 py-10 text-center`}>
                    <p className={`${display} text-lg font-bold`}>No recordings yet</p>
                    <p className="mt-1 text-sm text-[#4A5568]">Record a short practice take and it will show up here.</p>
                </div>
            ) : (
                <ul className="grid gap-4">
                    {recordings.map((rec) => (
                        <li key={rec.id}>
                            <Link
                                href={`/recordings/${rec.id}`}
                                className={`${card} flex items-center justify-between gap-4 px-6 py-5 ${focus}`}
                            >
                                <div>
                                    <p className={`${display} text-lg font-bold`}>
                                        <LocalTime iso={rec.createdAt.toISOString()} />
                                    </p>
                                    <p className="mt-1 text-sm text-[#4A5568]">
                                        {formatDuration(rec.seconds)} · {formatSize(rec.sizeBytes)}
                                    </p>
                                </div>
                                <span className="text-sm font-semibold text-[#1F7A8C]">
                                    {statusLabel[rec.analysisStatus] ?? "Not analyzed"}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}