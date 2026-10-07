import Link from "next/link";
import { redirect } from "next/navigation";
import { Play } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { formatDuration, formatSize } from "@/lib/format";
import LocalTime from "@/components/LocalTime";
import DeleteRecordingButton from "@/components/DeleteRecordingButton";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";
const btn =
    "inline-flex h-[52px] items-center rounded-full bg-[#14213D] px-[30px] text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_0_0_5px_rgba(255,255,255,0.8)] hover:bg-[#1d2f55]";

export default async function RecordingsPage() {
    const userId = await getUserId();
    if (!userId) redirect("/signup");

    const recordings = await prisma.recording.findMany({
        where: { userId, status: "READY" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="mx-auto max-w-[880px]">
            <div className="flex items-center justify-between gap-4 pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>My recordings</h1>
                {recordings.length > 0 && (
                    <Link href="/practice" className={`${btn} ${focus}`}>New</Link>
                )}
            </div>

            {recordings.length === 0 ? (
                <div className={`${card} px-6 py-16 text-center`}>
                    <h2 className={`${display} text-2xl font-extrabold`}>No recordings yet</h2>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-[#4A5568]">
                        Recordings you choose to save show up here. Anything you discard is never stored.
                    </p>
                    <Link href="/practice" className={`${btn} mt-7 ${focus}`}>Start practicing</Link>
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2">
                    {recordings.map((r) => (
                        <li key={r.id} className={`${card} overflow-hidden`}>
                            <Link href={`/recordings/${r.id}`} className={`block ${focus}`}>
                                <div className="relative grid aspect-video place-items-center bg-[#14213D]">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-[#FAF8F5] text-[#14213D]">
                    <Play size={20} className="fill-current" />
                  </span>
                                    <span className="absolute bottom-3 left-4 rounded-full bg-[#FAF8F5]/15 px-3 py-1 font-mono text-xs font-semibold text-[#FAF8F5]">
                    {formatDuration(r.seconds)}
                  </span>
                                </div>
                                <div className="px-5 pt-4">
                                    <h2 className={`${display} text-base font-bold`}>Practice session</h2>
                                    <p className="mt-0.5 text-sm text-[#4A5568]">
                                        <LocalTime iso={r.createdAt.toISOString()} /> &middot; {formatSize(r.sizeBytes)}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex justify-end px-4 pb-3 pt-2">
                                <DeleteRecordingButton id={r.id} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}