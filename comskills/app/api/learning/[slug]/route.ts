import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { getLesson } from "@/lib/lessons";

type Ctx = { params: Promise<{ slug: string }> };

async function check(params: Ctx["params"]) {
    const userId = await getUserId();
    if (!userId) return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
    const { slug } = await params;
    if (!getLesson(slug)) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
    return { userId, slug };
}

// Mark a lesson complete
export async function PUT(_req: Request, { params }: Ctx) {
    const r = await check(params);
    if (r.error) return r.error;
    await prisma.lessonProgress.upsert({
        where: { userId_lessonSlug: { userId: r.userId, lessonSlug: r.slug } },
        create: { userId: r.userId, lessonSlug: r.slug },
        update: {},
    });
    return NextResponse.json({ completed: true });
}

// Undo
export async function DELETE(_req: Request, { params }: Ctx) {
    const r = await check(params);
    if (r.error) return r.error;
    await prisma.lessonProgress.deleteMany({ where: { userId: r.userId, lessonSlug: r.slug } });
    return NextResponse.json({ completed: false });
}