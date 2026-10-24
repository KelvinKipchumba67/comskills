"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Shuffle } from "lucide-react";
import { ANGLES, CATEGORIES, type CategoryId } from "@/lib/words";

const display = "font-[family-name:var(--font-sora)] tracking-[-0.03em]";
const card = "rounded-[28px] bg-white shadow-[0_20px_50px_-22px_rgba(20,33,61,0.2)]";
const focus =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A8C]";

type Choice = CategoryId | "mixed";

const chip = (on: boolean) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${focus} ${
        on ? "bg-[#14213D] text-white" : "bg-[#EFEAE2] text-[#14213D] hover:bg-[#e4ddd2]"
    }`;

function poolFor(choice: Choice): string[] {
    if (choice === "mixed") return CATEGORIES.flatMap((c) => c.words);
    return CATEGORIES.find((c) => c.id === choice)?.words ?? [];
}

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}
export default function WordPrompt() {
    const [choice, setChoice] = useState<Choice>("mixed");
    const [word, setWord] = useState<string | null>(null);
    const [angle, setAngle] = useState<string>(ANGLES[0]);
    const [spinning, setSpinning] = useState(false);
    const [announce, setAnnounce] = useState("");
    const bag = useRef<string[]>([]);
    const bagFor = useRef<Choice | null>(null);
    const lastWord = useRef<string | null>(null);
    const timer = useRef<number | null>(null);

    const draw = useCallback((c: Choice) => {
        if (bagFor.current !== c || bag.current.length === 0) {
            const fresh = [...poolFor(c)];
            for (let i = fresh.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [fresh[i], fresh[j]] = [fresh[j], fresh[i]];
            }

            if (fresh.length > 1 && fresh[fresh.length - 1] === lastWord.current) {
                fresh.unshift(fresh.pop() as string);
            }
            bag.current = fresh;
            bagFor.current = c;
        }
        const next = bag.current.pop() as string;
        lastWord.current = next;
        return next;
    }, []);

    const roll = useCallback(
        (c: Choice) => {
            if (timer.current) window.clearInterval(timer.current);
            const final = draw(c);

            const land = () => {
                setWord(final);
                setAngle(pick(ANGLES));
                setSpinning(false);
                setAnnounce(`Your word is ${final}`);
            };


            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                land();
                return;
            }

          
            setSpinning(true);
            let ticks = 0;
            timer.current = window.setInterval(() => {
                ticks += 1;
                if (ticks >= 8) {
                    if (timer.current) window.clearInterval(timer.current);
                    timer.current = null;
                    land();
                } else {
                    setWord(pick(poolFor(c)));
                }
            }, 70);
        },
        [draw],
    );


    useEffect(() => {
        roll("mixed");
        return () => {
            if (timer.current) window.clearInterval(timer.current);
        };
    }, [roll]);

    function choose(c: Choice) {
        setChoice(c);
        roll(c);
    }

    return (
        <section aria-labelledby="word-heading" className={`${card} mb-6 px-6 py-6 sm:px-8 sm:py-7`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                    id="word-heading"
                    className="font-[family-name:var(--font-sora)] text-[11px] font-bold uppercase tracking-[0.18em] text-[#4A5568]"
                >
                    Practice word
                </h2>
                <button
                    type="button"
                    onClick={() => roll(choice)}
                    disabled={spinning}
                    className={`inline-flex h-11 items-center gap-2 rounded-full bg-[#14213D] px-5 font-[family-name:var(--font-sora)] text-xs font-extrabold uppercase tracking-[0.14em] text-white hover:bg-[#1d2f55] disabled:cursor-progress disabled:opacity-70 ${focus}`}
                >
                    <Shuffle size={16} aria-hidden="true" /> New word
                </button>
            </div>

            <p
                className={`${display} mt-4 min-h-[1.1em] text-[clamp(36px,8vw,68px)] font-extrabold leading-[1.05] text-[#14213D] transition-opacity ${
                    spinning ? "opacity-50" : "opacity-100"
                }`}
            >
                {word ?? "..."}
            </p>

            <p className="mt-2 text-[15px] leading-relaxed text-[#4A5568]">
                <span className="font-semibold text-[#14213D]">Speak for about a minute.</span> {angle}
            </p>

            <div role="group" aria-label="Kind of word" className="mt-5 flex flex-wrap gap-2">
                <button type="button" aria-pressed={choice === "mixed"} onClick={() => choose("mixed")} className={chip(choice === "mixed")}>
                    Mixed
                </button>
                {CATEGORIES.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        aria-pressed={choice === c.id}
                        onClick={() => choose(c.id)}
                        className={chip(choice === c.id)}
                    >
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Tells screen reader users the final word once the spin has stopped. */}
            <p role="status" className="sr-only">
                {announce}
            </p>
        </section>
    );
}