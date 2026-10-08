import type { Insight, Metrics, Moment } from "./types";

const topFillers = (byWord: Record<string, number>) =>
    Object.entries(byWord)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([w, c]) => `"${w}" (${c})`)
        .join(", ");

// Turns the measurements into plain-language strengths and things to work on.
// These rules are the dependable part of the feedback. They work even if the AI coaching step is unavailable.
export function buildInsights(m: Metrics): Insight[] {
    if (!m.enoughSpeech) {
        return [
            {
                kind: "improve",
                title: "Not enough speech to measure",
                detail: "Try a take of at least 20 seconds so there is enough to analyze.",
            },
        ];
    }

    const out: Insight[] = [];
    const byFast = [...m.paceWindows].sort((a, b) => b.wpm - a.wpm);
    const win = (w: { start: number; wpm: number }): Moment => ({ at: w.start, label: `${w.wpm} wpm` });

    // Pace
    if (m.wpm >= 130 && m.wpm <= 160) {
        out.push({
            kind: "strength",
            title: "Comfortable pace",
            detail: `You spoke at about ${m.wpm} words a minute, a range most listeners follow easily.`,
        });
    } else if (m.wpm > 175) {
        out.push({
            kind: "improve",
            title: "Your pace runs fast",
            detail: `You averaged about ${m.wpm} words a minute. Slowing down a little helps your key points land.`,
            moments: byFast.slice(0, 2).map(win),
        });
    } else if (m.wpm < 110) {
        out.push({
            kind: "improve",
            title: "Your pace runs slow",
            detail: `You averaged about ${m.wpm} words a minute. A bit more energy between your pauses will keep people with you.`,
            moments: byFast.slice(-2).map(win),
        });
    }

    // Steadiness
    if (m.paceWindows.length >= 3) {
        if (m.paceSteadiness <= 0.15) {
            out.push({
                kind: "strength",
                title: "Steady pace",
                detail: "Your speed stayed consistent through the whole take, which sounds confident and controlled.",
            });
        } else if (m.paceSteadiness >= 0.3) {
            out.push({
                kind: "improve",
                title: "Your pace swings",
                detail: "Your speed changed a lot between sections. The fastest and slowest stretches are linked below.",
                moments: [byFast[0], byFast[byFast.length - 1]].map(win),
            });
        }
    }

    // Filler words
    const f = m.fillers;
    if (f.total === 0) {
        out.push({ kind: "strength", title: "No filler words", detail: "We didn't hear any um, uh or you know. That sounds clean and prepared." });
    } else if (f.perMinute <= 1.5) {
        out.push({
            kind: "strength",
            title: "Few filler words",
            detail: `Only ${f.total} filler ${f.total === 1 ? "word" : "words"} in the whole take. That is well under control.`,
        });
    } else if (f.perMinute > 2.5) {
        out.push({
            kind: "improve",
            title: "Filler words",
            detail: `You used ${f.total} filler words (${f.perMinute} a minute), mostly ${topFillers(f.byWord)}. Try replacing each one with a short pause.`,
            moments: f.moments.slice(0, 6),
        });
    }

    // Pauses
    if (m.longPauses.length >= 2) {
        out.push({
            kind: "improve",
            title: "Long silences",
            detail: `There were ${m.longPauses.length} pauses of 2 seconds or more. A beat is powerful, but long gaps can sound like losing your place.`,
            moments: m.longPauses.slice(0, 4).map((p) => ({ at: p.at, label: `${p.length}s` })),
        });
    }
    if (m.naturalPauses / (m.durationSec / 60) >= 3) {
        out.push({
            kind: "strength",
            title: "You use pauses well",
            detail: "You paused between ideas, which gives listeners time to take each one in.",
        });
    }

    // Repeats
    if (m.repetitions.length >= 3) {
        out.push({
            kind: "improve",
            title: "Repeated words",
            detail: "A few words came out twice in a row. Slowing down just before them usually fixes it.",
            moments: m.repetitions.slice(0, 4),
        });
    }

    return out;
}