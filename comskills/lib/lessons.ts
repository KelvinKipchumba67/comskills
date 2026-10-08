export type Lesson = {
    slug: string;
    title: string;
    focus: string;
    minutes: number;
    summary: string;
    sections: { heading: string; body: string }[];
    exercise: string;
};

// Draft copy: edit freely, and add lessons by adding items here.
// Keep each slug the same once people start finishing lessons, because progress is saved by slug.
export const LESSONS: Lesson[] = [
    {
        slug: "find-your-pace",
        title: "Find your pace",
        focus: "Pacing",
        minutes: 4,
        summary: "Speak at a speed people can follow, and use pauses instead of rushing.",
        sections: [
            {
                heading: "Why pace matters",
                body: "Most listeners follow comfortably at roughly 130 to 160 words a minute. Go much faster and your key points blur together. Nerves usually push people faster than they realise.",
            },
            {
                heading: "Pause instead of rush",
                body: "A short pause after an important point gives listeners time to absorb it and gives you time to think. Take a brief beat at the end of each sentence and a longer one before a new idea.",
            },
            {
                heading: "Check yourself",
                body: "Record a minute of your talk, watch it back, and notice where you sped up. Those spots are usually the parts you feel least sure about.",
            },
        ],
        exercise: "Record a 60-second explanation of your topic. Mark every place you sped up, then record it again and pause at each one.",
    },
    {
        slug: "cut-the-fillers",
        title: "Cut the filler words",
        focus: "Clarity",
        minutes: 4,
        summary: "Replace um, uh and like with a calm pause.",
        sections: [
            {
                heading: "What fillers do",
                body: "Words like um, uh, like and you know fill silence while your brain catches up. A few are natural. A lot of them make you sound less sure than you are.",
            },
            {
                heading: "Swap them for silence",
                body: "When you feel a filler coming, close your mouth and pause. The silence feels long to you and is barely noticeable to your audience.",
            },
            {
                heading: "Know your habit",
                body: "Most people lean on one or two favourite fillers. Find yours in a recording and work on just those instead of trying to fix everything at once.",
            },
        ],
        exercise: "Record a minute of unscripted speech and count your fillers. Do it again, pausing every time one tries to slip out.",
    },
    {
        slug: "open-with-a-hook",
        title: "Open with a hook",
        focus: "Structure",
        minutes: 5,
        summary: "Win attention in the first 30 seconds.",
        sections: [
            {
                heading: "The first 30 seconds",
                body: "Audiences decide quickly whether to listen. Start with something that matters to them: a question, a surprising fact or a very short story.",
            },
            {
                heading: "Say where you are going",
                body: "After the hook, tell people in one sentence what you will cover. It gives them a path to follow and makes the rest easier to absorb.",
            },
            {
                heading: "Memorise your first line",
                body: "Nerves peak at the start. Knowing your first sentence word for word gets you moving, and the rest comes more easily after that.",
            },
        ],
        exercise: "Write three possible openings for your next talk. Record each one and keep the one that sounds most natural.",
    },
    {
        slug: "structure-every-point",
        title: "Structure every point",
        focus: "Structure",
        minutes: 5,
        summary: "Use point, reason, example, point to keep answers clear.",
        sections: [
            {
                heading: "Point, reason, example, point",
                body: "State your point, give the reason, show an example, then restate the point. It works for interview answers and for each section of a presentation.",
            },
            {
                heading: "One idea at a time",
                body: "Finish a point before starting the next. If one answer holds two ideas, split it in two.",
            },
            {
                heading: "End on purpose",
                body: "Close by restating the main takeaway instead of trailing off. People remember how you finish.",
            },
        ],
        exercise: "Answer 'Why should we choose you?' in under 90 seconds using point, reason, example, point.",
    },
];

export const getLesson = (slug: string) => LESSONS.find((l) => l.slug === slug);