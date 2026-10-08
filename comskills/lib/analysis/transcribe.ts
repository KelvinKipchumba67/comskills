import { AssemblyAI } from "assemblyai";
import type { Word } from "./types";

function client() {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) throw new Error("ASSEMBLYAI_API_KEY is not set");
    return new AssemblyAI({ apiKey });
}

// "disfluencies: true" keeps um/uh in the transcript. They are removed by default.
export async function transcribeFromUrl(url: string): Promise<{ id: string; text: string; words: Word[] }> {
    const t = await client().transcripts.transcribe({ audio: url, disfluencies: true });
    if (t.status === "error") throw new Error(t.error ?? "Transcription failed");

    const words: Word[] = (t.words ?? []).map((w) => ({
        text: w.text,
        start: w.start / 1000, // the API gives milliseconds
        end: w.end / 1000,
    }));
    return { id: t.id, text: t.text ?? "", words };
}

// Removes the transcript from AssemblyAI once we have what we need.
export async function deleteTranscript(id: string) {
    try {
        await client().transcripts.delete(id);
    } catch {
        // Not worth failing the analysis over
    }
}