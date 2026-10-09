import type { Insight, Metrics, Moment } from "./types";

const topFillers = (byWord: Record<string, number>) =>
    Object.entries(byWord)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([w, c]) => `"${w}" (${c})`)
        .join(", ");

// Turns the measurements into plain-language strengths and things to work on.
// These rules are the dependable part of the feedback. They work even if the AI coaching step is unavailable.
// There is always at least one thing to work on and one thing that went well, so the page is never empty.
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
            detail: `You averaged about ${m.wpm} words a minute. Slowing down helps your key points land.`,
            moments: byFast.slice(0, 2).map(win),
        });
    } else if (m.wpm > 160) {
        out.push({
            kind: "improve",
            title: "Slightly fast",
            detail: `At about ${m.wpm} words a minute you are a touch quicker than the comfortable 130 to 160. Easing off, especially on key points, helps them land.`,
            moments: byFast.slice(0, 2).map(win),
        });
    } else if (m.wpm < 110) {
        out.push({
            kind: "improve",
            title: "Your pace runs slow",
            detail: `You averaged about ${m.wpm} words a minute. A bit more energy between your pauses will keep people with you.`,
            moments: byFast.slice(-2).map(win),
        });
    } else {
        out.push({
            kind: "improve",
            title: "Slightly slow",
            detail: `At about ${m.wpm} words a minute you are a little under the comfortable 130 to 160. Picking up the pace between pauses keeps energy up.`,
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
    } else if (f.perMinute <= 1) {
        out.push({
            kind: "strength",
            title: "Few filler words",
            detail: `Only ${f.total} filler ${f.total === 1 ? "word" : "words"} in the whole take. That is well under control.`,
        });
    } else {
        out.push({
            kind: "improve",
            title: "Filler words",
            detail: `You used ${f.total} filler words (${f.perMinute} a minute), mostly ${topFillers(f.byWord)}. Try replacing each one with a short pause.`,
            moments: f.moments.slice(0, 6),
        });
    }

    // Pauses
    if (m.longPauses.length >= 1) {
        out.push({
            kind: "improve",
            title: m.longPauses.length === 1 ? "A long silence" : "Long silences",
            detail:
                m.longPauses.length === 1
                    ? `There was one pause of ${m.longPauses[0].length} seconds. A beat is powerful, but a gap this long can sound like losing your place.`
                    : `There were ${m.longPauses.length} pauses of 2 seconds or more. A beat is powerful, but long gaps can sound like losing your place.`,
            moments: m.longPauses.slice(0, 4).map((p) => ({ at: p.at, label: `${p.length}s` })),
        });
    }
    const pausesPerMin = m.naturalPauses / (m.durationSec / 60);
    if (pausesPerMin >= 3) {
        out.push({
            kind: "strength",
            title: "You use pauses well",
            detail: "You paused between ideas, which gives listeners time to take each one in.",
        });
    } else if (pausesPerMin < 1.5) {
        out.push({
            kind: "improve",
            title: "Add more pauses",
            detail: "You rarely paused between ideas. A short pause before each new point gives listeners time to keep up and makes you sound more in control.",
        });
    }

    // Repeats
    if (m.repetitions.length >= 2) {
        out.push({
            kind: "improve",
            title: "Repeated words",
            detail: "A few words came out twice in a row. Slowing down just before them usually fixes it.",
            moments: m.repetitions.slice(0, 4),
        });
    }

    // Never leave either list empty
    if (!out.some((i) => i.kind === "improve")) {
        out.push({
            kind: "improve",
            title: "Next level: make your key point land",
            detail: "Your delivery is solid. To stand out, slow down and pause just before your most important line, then say it with more emphasis.",
        });
    }
    if (!out.some((i) => i.kind === "strength")) {
        out.push({
            kind: "strength",
            title: "You put in the practice",
            detail: `You spoke for about ${Math.round(m.durationSec)} seconds. Recording yourself regularly is the habit that builds this skill.`,
        });
    }

    return out;
}