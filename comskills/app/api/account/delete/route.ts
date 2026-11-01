import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/Server";
import { supabaseAdmin, RECORDINGS_BUCKET } from "@/lib/supabaseAdmin";
export const maxDuration = 60;

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });


async function removeAllFiles(userId: string) {
    const bucket = supabaseAdmin.storage.from(RECORDINGS_BUCKET);
    for (let page = 0; page < 50; page++) {
        const { data, error } = await bucket.list(userId, { limit: 100 });
        if (error) throw error;
        if (!data || data.length === 0) return;
        const { error: removeError } = await bucket.remove(data.map((f) => `${userId}/${f.name}`));
        if (removeError) throw removeError;
    }
    throw new Error("more files remain after 50 pages");
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return bad("Not signed in", 401);

    let body: { confirm?: unknown };
    try {
        body = await request.json();
    } catch {
        return bad("That didn't look right. Please try again.");
    }
    const expected = (user.email ?? "DELETE").trim().toLowerCase();
    if (String(body.confirm ?? "").trim().toLowerCase() !== expected) {
        return bad("The confirmation text did not match.");
    }

    const userId = user.id;
    const email = user.email ?? null;
    
    try {
        await removeAllFiles(userId);

        await prisma.$transaction([
            prisma.recording.deleteMany({ where: { userId } }),
            prisma.lessonProgress.deleteMany({ where: { userId } }),
            prisma.contactMessage.deleteMany({
                where: email ? { OR: [{ userId }, { email: { equals: email, mode: "insensitive" } }] } : { userId },
            }),
        ]);

        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) throw error;
    } catch (e) {
        console.error("account deletion failed:", e instanceof Error ? e.message : "unknown error");
        return bad("We couldn't finish deleting your account. Please try again, and if it keeps failing, contact us.", 500);
    }

    return NextResponse.json({ ok: true });
}