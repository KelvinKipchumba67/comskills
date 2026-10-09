import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { supabaseAdmin, RECORDINGS_BUCKET } from "@/lib/supabaseAdmin";

type Ctx = { params: Promise<{ id: string }> };

// Step 3 of saving- confirm the file landed, then mark the recording ready.
export async function PATCH(_req: Request, { params }: Ctx) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const { id } = await params;

    const rec = await prisma.recording.findFirst({ where: { id, userId } });
    if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: files } = await supabaseAdmin.storage.from(RECORDINGS_BUCKET).list(userId, { search: id });
    if (!files?.length) return NextResponse.json({ error: "Upload not found" }, { status: 409 });

    await prisma.recording.update({ where: { id }, data: { status: "READY" } });
    return NextResponse.json({ id });
}

// Real delete- removes the file and the record together.
export async function DELETE(_req: Request, { params }: Ctx) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    const { id } = await params;

    const rec = await prisma.recording.findFirst({ where: { id, userId } });
    if (!rec) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await supabaseAdmin.storage.from(RECORDINGS_BUCKET).remove([rec.path]);
    await prisma.recording.delete({ where: { id } });
    return NextResponse.json({ id });
}