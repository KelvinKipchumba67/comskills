import type { Metrics, Moment, Word } from "./types";

// Sounds that are almost never real words, plus two common spoken crutches.
// "like" is deliberately not counted: it is often a real word, so counting it would give false marks.
const HARD_FILLERS = new Set(["um", "umm", "uh", "uhh", "uhm", "er", "erm", "ah", "eh", "hmm", "hm", "mm", "mhm"]);
const FILLER_PHRASES = new Set(["you know", "i mean"]);

const LONG_PAUSE = 2.0; // seconds
const NATURAL_PAUSE = 0.6; // seconds
const WINDOW = 15; // seconds

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
const r1 = (n: number) => Math.round(n * 10) / 10;

export function computeMetrics(words: Word[]): Metrics {
    const tokens = words.map((w) => ({ start: w.start, end: w.end, n: norm(w.text) })).filter((t) => t.n);

    // 1. Filler words
    const isFiller = new Array<boolean>(tokens.length).fill(false);
    const fillerMoments: Moment[] = [];
    const byWord: Record<string, number> = {};
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        const next = tokens[i + 1];
        if (HARD_FILLERS.has(t.n)) {
            isFiller[i] = true;
            byWord[t.n] = (byWord[t.n] ?? 0) + 1;
            fillerMoments.push({ at: r1(t.start), label: t.n });
        } else if (next && FILLER_PHRASES.has(`${t.n} ${next.n}`)) {
            const phrase = `${t.n} ${next.n}`;
            isFiller[i] = true;
            isFiller[i + 1] = true;
            byWord[phrase] = (byWord[phrase] ?? 0) + 1;
            fillerMoments.push({ at: r1(t.start), label: phrase });
            i++;
        }
    }
    const spoken = tokens.filter((_, i) => !isFiller[i]);
    const fillerTotal = fillerMoments.length;

    const first = tokens[0];
    const last = tokens[tokens.length - 1];
    const durationSec = first ? last.end - first.start : 0;

    // 2. Pauses
    const longPauses: { at: number; length: number }[] = [];
    let naturalPauses = 0;
    let longTotal = 0;
    for (let i = 1; i < tokens.length; i++) {
        const gap = tokens[i].start - tokens[i - 1].end;
        if (gap >= LONG_PAUSE) {
            longPauses.push({ at: r1(tokens[i - 1].end), length: r1(gap) });
            longTotal += gap;
        } else if (gap >= NATURAL_PAUSE) {
            naturalPauses++;
        }
    }

    const enoughSpeech = spoken.length >= 15 && durationSec >= 8;

    // 3. Pace overall, and in 15-second windows
    const activeSec = Math.max(1, durationSec - longTotal);
    const wpm = enoughSpeech ? Math.round(spoken.length / (activeSec / 60)) : 0;

    const paceWindows: { start: number; wpm: number }[] = [];
    if (enoughSpeech) {
        for (let s = first.start; s < last.end; s += WINDOW) {
            const e = Math.min(s + WINDOW, last.end);
            if (e - s < 8) break; // skip a short tail
            const count = spoken.filter((t) => t.start >= s && t.start < e).length;
            paceWindows.push({ start: r1(s), wpm: Math.round(count / ((e - s) / 60)) });
        }
    }
    let paceSteadiness = 0;
    if (paceWindows.length >= 3) {
        const vals = paceWindows.map((w) => w.wpm);
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
        paceSteadiness = mean > 0 ? Math.round((sd / mean) * 100) / 100 : 0;
    }

    // 4. Immediate repeats ("the the", "I I")
    const repetitions: Moment[] = [];
    for (let i = 1; i < tokens.length; i++) {
        if (
            !isFiller[i] && !isFiller[i - 1] &&
            tokens[i].n === tokens[i - 1].n &&
            tokens[i].start - tokens[i - 1].end < 1
        ) {
            repetitions.push({ at: r1(tokens[i].start), label: tokens[i].n });
        }
    }

    return {
        enoughSpeech,
        durationSec: r1(durationSec),
        wordCount: spoken.length,
        wpm,
        paceWindows,
        paceSteadiness,
        fillers: {
            total: fillerTotal,
            perMinute: durationSec > 0 ? r1(fillerTotal / (durationSec / 60)) : 0,
            byWord,
            moments: fillerMoments,
        },
        longPauses,
        naturalPauses,
        repetitions,
    };
}