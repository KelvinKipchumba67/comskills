import { createClient } from "@supabase/supabase-js";
import type { RecordingResult } from "@/hooks/useRecorder";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function uploadRecording(r: RecordingResult): Promise<{ id: string }> {
    const contentType = r.mimeType.split(";")[0]; // "video/webm;codecs=vp9,opus" -> "video/webm"

    const created = await fetch("/api/recordings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seconds: r.seconds, mimeType: contentType, size: r.blob.size }),
    });
    if (!created.ok) throw new Error("Could not start the upload");
    const { id, path, token } = await created.json();

    const { error } = await supabase.storage
        .from("recordings")
        .uploadToSignedUrl(path, token, r.blob, { contentType });
    if (error) {
        await fetch(`/api/recordings/${id}`, { method: "DELETE" });
        throw error;
    }

    const done = await fetch(`/api/recordings/${id}`, { method: "PATCH" });
    if (!done.ok) throw new Error("Could not finish the upload");
    return { id };
}