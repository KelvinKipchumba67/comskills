import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/auth";
import { supabaseAdmin, RECORDINGS_BUCKET } from "@/lib/supabaseAdmin";

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_SECONDS = 600;

// Step 1 of saving: create the record and hand back a signed upload URL for this one file.
export async function POST(req: Request) {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { seconds, mimeType, size } = body as { seconds?: number; mimeType?: string; size?: number };

    if (
        !Number.isFinite(seconds) || seconds! <= 0 || seconds! > MAX_SECONDS ||
        !Number.isFinite(size) || size! <= 0 || size! > MAX_BYTES ||
        typeof mimeType !== "string" || !mimeType.startsWith("video/")
    ) {
        return NextResponse.json({ error: "Invalid recording" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    const path = `${userId}/${id}.${ext}`;

    const { data, error } = await supabaseAdmin.storage.from(RECORDINGS_BUCKET).createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: "Could not prepare upload" }, { status: 500 });

    await prisma.recording.create({
        data: { id, userId, path, seconds: Math.round(seconds!), sizeBytes: size!, mimeType, status: "UPLOADING" },
    });

    return NextResponse.json({ id, path, token: data.token });
}