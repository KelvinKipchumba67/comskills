import { AssemblyAI } from "assemblyai";
import type { Word } from "./types";

const VERBATIM_PROMPT =
    "Transcribe exactly as spoken. Keep every filler word (um, uh, er, ah, hmm), false start, repeated word and stutter. Do not tidy up or correct the speech.";

function client() {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) throw new Error("ASSEMBLYAI_API_KEY is not set");
    return new AssemblyAI({ apiKey });
}

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

export async function deleteTranscript(id: string) {
    try {
        await client().transcripts.delete(id);
    } catch {
    }
}