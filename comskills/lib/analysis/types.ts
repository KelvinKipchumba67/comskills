export type Word = { text: string; start: number; end: number }; // seconds

export type Moment = { at: number; label: string }; // "at" = seconds into the recording

export type Metrics = {
    enoughSpeech: boolean;
    durationSec: number; // first word to last word
    wordCount: number; // spoken words, filler words not counted
    wpm: number; // pace while speaking (long silences excluded)
    paceWindows: { start: number; wpm: number }[]; // 15-second windows
    paceSteadiness: number; // spread of the window paces (lower = steadier)
    fillers: { total: number; perMinute: number; byWord: Record<string, number>; moments: Moment[] };
    longPauses: { at: number; length: number }[]; // gaps of 2 seconds or more
    naturalPauses: number; // gaps between 0.6 and 2 seconds
    repetitions: Moment[];
};

export type Insight = {
    kind: "strength" | "improve";
    title: string;
    detail: string;
    moments?: Moment[];
};

export type Coach = {
    summary: string;
    strengths: string[];
    improvements: { issue: string; tip: string }[];
    nextFocus: string;
    structure: string;
};

export type AnalysisResult = {
    version: 1;
    metrics: Metrics;
    insights: Insight[];
    coach: Coach | null;
    coachModel: string | null;
    coachError?: string | null; // plain-language reason the written coaching is missing
};