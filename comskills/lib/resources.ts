export type Guide = { title: string; summary: string; tips: string[] };
export type Category = { id: string; title: string; blurb: string; guides: Guide[] };
export type Drill = { title: string; time: string; steps: string[] };
export type Reading = { title: string; source: string; format: string; href: string; note: string };
export const FACTS = [
    { label: "Pace", value: "130 to 160", unit: "words a minute", note: "A range most listeners follow easily." },
    { label: "Filler words", value: "Under 1", unit: "a minute", note: "Few enough that they go unnoticed." },
    { label: "Pauses", value: "0.6 to 2", unit: "seconds", note: "Between ideas. Longer gaps can sound like losing your place." },
    { label: "Take length", value: "20+", unit: "seconds", note: "The shortest take Comskill can analyze." },
];

export const CATEGORIES: Category[] = [
    {
        id: "delivery",
        title: "Delivery",
        blurb: "How you sound: speed, silence and the small habits that get in the way.",
        guides: [
            {
                title: "Find a comfortable pace",
                summary: "Most people follow speech at around 130 to 160 words a minute. Faster can feel rushed, slower can lose energy.",
                tips: [
                    "Read a page aloud for one minute, then count the words to find your natural pace.",
                    "Slow down on your most important sentence, not the whole talk.",
                    "Breathe at every full stop. A breath is a pause your audience welcomes.",
                    "If you speed up when nervous, write 'slow' at the top of your notes.",
                ],
            },
            {
                title: "Use pauses on purpose",
                summary: "A pause lets an idea land. To you it feels long. To listeners it sounds confident.",
                tips: [
                    "Pause for a beat before and after your key point.",
                    "Aim for a short pause between ideas, roughly half a second to two seconds.",
                    "Replace each filler word with a silent beat.",
                    "Save gaps longer than two seconds for moments you choose, not moments you lose your place.",
                ],
            },
            {
                title: "Cut filler words",
                summary: "Ums and uhs are a habit, not a flaw. Fewer of them makes you sound prepared.",
                tips: [
                    "Record yourself and notice where they cluster. It is usually at the start of sentences and in transitions.",
                    "Write your transitions down in advance so you are not hunting for them live.",
                    "Slow down a little. Fillers rush in when your mouth moves faster than your thoughts.",
                    "Work on one filler word at a time.",
                ],
            },
            {
                title: "Keep your pace steady",
                summary: "Big swings in speed are hard to follow. Variety is good, lurching is not.",
                tips: [
                    "Check your Steady pace result after each take and try to lower it.",
                    "Speed up a little for background, and slow down for the point.",
                    "Rehearse the same passage three times and aim for the same speed each time.",
                ],
            },
        ],
    },
    {
        id: "structure",
        title: "Structure",
        blurb: "What you say, and in what order, so people can follow you.",
        guides: [
            {
                title: "Open strong",
                summary: "The first twenty seconds decide whether people lean in.",
                tips: [
                    "Start with your main point, a short question or a one-line story.",
                    "Skip apologies like 'sorry, I'm nervous' and long warm-ups.",
                    "Rehearse your first twenty seconds until they feel automatic.",
                    "Look at the camera, or at the room, for your first sentence.",
                ],
            },
            {
                title: "Answer in three beats",
                summary: "Interviews and meetings reward answers that are easy to follow.",
                tips: [
                    "Point, Reason, Example: give your answer, say why, then share a real example.",
                    "For 'tell me about a time' questions, use Situation, Task, Action, Result.",
                    "Aim for 60 to 90 seconds. Shorter is fine if it is complete.",
                    "Finish by repeating your point in one short sentence.",
                ],
            },
            {
                title: "Close with one takeaway",
                summary: "People remember how you end. Make it one clear sentence.",
                tips: [
                    "Decide the single sentence you want remembered.",
                    "Say it slowly, pause, then stop.",
                    "Do not trail off or add 'so... yeah'.",
                    "Say thank you or invite questions, then stay quiet.",
                ],
            },
        ],
    },
    {
        id: "confidence",
        title: "Confidence",
        blurb: "Getting comfortable with the moment, and with hearing yourself.",
        guides: [
            {
                title: "Settle your nerves before you speak",
                summary: "Nerves are normal, and they are mostly energy you can steer.",
                tips: [
                    "Breathe in for four counts and out for six, a few times.",
                    "Stand or sit tall, feet planted and shoulders loose.",
                    "Say your first sentence out loud once before you begin.",
                    "Arrive early so you are not rushing into it.",
                ],
            },
            {
                title: "Practice out loud, not in your head",
                summary: "Reading silently can't prepare you to speak. Your mouth needs the rehearsal too.",
                tips: [
                    "Say it aloud, ideally standing, at the volume you will really use.",
                    "Record it and watch it back. It feels strange at first, and it works.",
                    "Short and often beats long and rare. Five minutes a day beats an hour once a month.",
                    "Keep your earlier takes so you can see how far you have come.",
                ],
            },
        ],
    },
];

export const DRILLS: Drill[] = [
    {
        title: "The five-minute loop",
        time: "5 minutes",
        steps: [
            "Pick a topic, such as what you did today or an idea you are working on.",
            "Record 60 seconds in Practice and save it.",
            "Click Analyze and read What to work on.",
            "Choose one thing to fix.",
            "Record again and compare the two takes.",
        ],
    },
    {
        title: "Read-aloud pace check",
        time: "3 minutes",
        steps: [
            "Choose a page of any article or book.",
            "Read it aloud for exactly one minute.",
            "Count the words you read. That number is your pace in words a minute.",
            "If you are outside 130 to 160, repeat and nudge yourself toward that range.",
        ],
    },
    {
        title: "Pause practice",
        time: "4 minutes",
        steps: [
            "Write three sentences you want your audience to remember.",
            "Say each one, then count two silent beats before the next.",
            "Record all three and check your silences in the results.",
            "Compare with a take where you did not pause on purpose.",
        ],
    },
    {
        title: "Interview answer, three takes",
        time: "10 minutes",
        steps: [
            "Choose a common question, such as 'tell me about yourself'.",
            "Plan your answer as Point, Reason, Example.",
            "Record three takes of 60 to 90 seconds each.",
            "Analyze all three and notice which had the fewest fillers and the steadiest pace.",
        ],
    },
];

// Outside resources. Each entry shows as a card that opens in a new tab.
// Add or remove entries freely. Leave the list empty and the "Keep learning" section is hidden.
// Check the links now and then, because other sites move or remove pages.
export const READING: Reading[] = [
    {
        title: "How to Write and Deliver a Speech",
        source: "Toastmasters International",
        format: "Guide",
        href: "https://www.toastmasters.org/resources/public-speaking-tips/preparing-a-speech",
        note: "A start-to-finish guide to planning, writing and delivering a speech. A good first read.",
    },
    {
        title: "Public Speaking Tips",
        source: "Toastmasters International",
        format: "Articles",
        href: "https://toastmasters.org/Resources/Public-Speaking-Tips",
        note: "A hub of practical advice, including how to overcome the fear of speaking.",
    },
    {
        title: "How to Speak So That People Want to Listen",
        source: "Julian Treasure, TED",
        format: "Video, about 10 min",
        href: "https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen",
        note: "A sound expert on voice, with simple warm-up exercises you can try right away.",
    },
    {
        title: "5 Ways to Listen Better",
        source: "Julian Treasure, TED",
        format: "Video, about 8 min",
        href: "https://www.ted.com/talks/julian_treasure_5_ways_to_listen_better",
        note: "Good speakers are good listeners. Short, practical ideas for paying better attention.",
    },
    {
        title: "How to Give a Killer Presentation",
        source: "Chris Anderson, Harvard Business Review",
        format: "Article",
        href: "https://hbr.org/2013/06/how-to-give-a-killer-presentation",
        note: "Lessons from TED's curator on framing your story and rehearsing. May need a free account to read in full.",
    },
    {
        title: "Exploring Public Speaking",
        source: "Open College textbook",
        format: "Free textbook",
        href: "https://open.maricopa.edu/exploringpublicspeaking",
        note: "A complete, free public speaking course in book form, covering audiences, structure, introductions and conclusions.",
    },
    {
        title: "Dynamic Public Speaking Specialization",
        source: "University of Washington, Coursera",
        format: "Online course",
        href: "https://www.coursera.org/specializations/public-speaking",
        note: "A four-course program on voice, gesture, storytelling and speechwriting. Coursera may charge for it.",
    },
];