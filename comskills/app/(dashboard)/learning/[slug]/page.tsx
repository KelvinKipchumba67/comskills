import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Mic } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { getLesson } from "@/lib/lessons";
import MarkCompleteButton from "@/components/MarkCompleteButton";

export const dynamic = "force-dynamic";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const lesson = getLesson(slug);
    if (!lesson) notFound();

    const userId = await getUserId();
    if (!userId) redirect("/signup");

    const progress = await prisma.lessonProgress.findUnique({
        where: { userId_lessonSlug: { userId, lessonSlug: slug } },
    });

    return (
        <div className="mx-auto max-w-[720px]">
            <Link
                href="/learning"
                className={`mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A5568] hover:text-[#14213D] ${focus}`}
            >
                <ArrowLeft size={16} /> My learning
            </Link>

            <div className="pb-7 pt-2">
                <h1 className={`${display} text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.05]`}>{lesson.title}</h1>
                <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#1F7A8C]">
                    {lesson.focus} &middot; {lesson.minutes} min
                </p>
            </div>

            <div className={`${card} divide-y divide-[#14213D]/10 px-7`}>
                {lesson.sections.map((s) => (
                    <section key={s.heading} className="py-6">
                        <h2 className={`${display} text-lg font-bold`}>{s.heading}</h2>
                        <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568]">{s.body}</p>
                    </section>
                ))}
            </div>

            <div className="mt-5 rounded-[28px] bg-[#EFEAE2] px-7 py-6">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em]">Try it</p>
                <p className="mt-2 text-[15px] leading-relaxed">{lesson.exercise}</p>
                <Link
                    href="/practice"
                    className={`mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] hover:text-[#1F7A8C] ${focus}`}
                >
                    <Mic size={16} /> Practice this
                </Link>
            </div>

            <div className="mt-8">
                <MarkCompleteButton slug={slug} completed={!!progress} />
            </div>
        </div>
    );
}