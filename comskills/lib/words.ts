export type CategoryId = "everyday" | "ideas" | "feelings" | "places";
export type Category = { id: CategoryId; label: string; words: string[] };

export const CATEGORIES: Category[] = [
    {
        id: "everyday",
        label: "Everyday objects",
        words: [
            "umbrella", "bicycle", "mirror", "backpack", "kettle", "staircase", "notebook", "window", "candle", "suitcase",
            "clock", "ladder", "lantern", "passport", "button", "envelope", "compass", "blanket", "ticket", "key",
            "bell", "map", "pencil", "sandwich", "bucket", "doorway", "fence", "radio", "scarf", "tea",
        ],
    },
    {
        id: "ideas",
        label: "Big ideas",
        words: [
            "trust", "courage", "patience", "curiosity", "change", "freedom", "responsibility", "teamwork", "discipline", "honesty",
            "ambition", "balance", "creativity", "fairness", "generosity", "humility", "leadership", "listening", "loyalty", "opportunity",
            "progress", "respect", "risk", "success", "tradition", "kindness", "focus", "failure", "community", "habit",
        ],
    },
    {
        id: "feelings",
        label: "Feelings and moments",
        words: [
            "excitement", "nervousness", "pride", "surprise", "relief", "gratitude", "boredom", "hope", "regret", "laughter",
            "silence", "waiting", "celebration", "homesickness", "confidence", "embarrassment", "wonder", "frustration", "calm", "jealousy",
            "fear", "joy", "loneliness", "belonging", "comfort", "awe", "determination", "nostalgia", "disappointment", "friendship",
        ],
    },
    {
        id: "places",
        label: "Places and nature",
        words: [
            "river", "mountain", "market", "harbor", "forest", "desert", "village", "airport", "library", "farm",
            "rainstorm", "sunrise", "island", "valley", "classroom", "kitchen", "rooftop", "train station", "beach", "garden",
            "cave", "waterfall", "highway", "stadium", "campfire", "meadow", "lake", "bus stop", "city street", "bakery",
        ],
    },
];

export const ANGLES = [
    "Tell a short story that includes it.",
    "Explain it to a ten-year-old.",
    "Give three pieces of advice about it.",
    "Say why it matters, with one real example.",
    "Describe it so well that someone could picture it.",
    "Argue that everyone needs more of it, or less of it.",
];