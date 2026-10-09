import { AssemblyAI } from "assemblyai";
import type { Word } from "./types";

// Universal-3 Pro ignores the old "disfluencies" switch, so filler words have to be requested in a prompt.
const VERBATIM_PROMPT =
    "Transcribe exactly as spoken. Keep every filler word (um, uh, er, ah, hmm), false start, repeated word and stutter. Do not tidy up or correct the speech.";

function client() {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) throw new Error("ASSEMBLYAI_API_KEY is not set");
    return new AssemblyAI({ apiKey });
}

// Default: Universal-3 Pro (most accurate, copes better with accents), falling back to Universal-2.
// Set ASSEMBLYAI_MODEL=universal-2 in .env to use the older model, which supports "disfluencies" directly.
export async function transcribeFromUrl(url: string): Promise<{ id: string; text: string; words: Word[] }> {
    const useV2 = process.env.ASSEMBLYAI_MODEL === "universal-2";

    const t = await client().transcripts.transcribe({
        audio: url,
        language_code: "en",
        disfluencies: true,
        ...(useV2
            ? { speech_models: ["universal-2"] as const }
            : { speech_models: ["universal-3-pro", "universal-2"] as const, prompt: VERBATIM_PROMPT }),
    });
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