type Mood = "happy" | "talking" | "farewell" | "sad";

type MascotProps = {
    mood?: Mood;
    size?: number;
    className?: string;
    title?: string;
};
export default function Mascot({
                                   mood = "happy",
                                   size = 240,
                                   className = "",
                                   title = "Comsky, the Comskill mascot",
                               }: MascotProps) {
    const talking = mood === "talking";
    const farewell = mood === "farewell";
    const sad = mood === "sad";

    return (
        <svg
            viewBox="0 0 200 216"
            role="img"
            aria-label={title}
            className={`overflow-visible ${className}`}
            style={{ width: size, maxWidth: "100%", height: "auto" }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>{`
        .mascot-float { animation: mascot-float 4s ease-in-out infinite; }
        .mascot-eye { transform-box: fill-box; transform-origin: center; animation: mascot-blink 5.5s infinite; }
        .mascot-talk { transform-box: fill-box; transform-origin: center; animation: mascot-talk 0.7s ease-in-out infinite alternate; }
        .mascot-wave { animation: mascot-wave 1.6s ease-in-out infinite; }
        .mascot-wave-2 { animation-delay: 0.3s; }
        @keyframes mascot-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes mascot-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes mascot-talk { from { transform: scaleY(0.45); } to { transform: scaleY(1); } }
        @keyframes mascot-wave { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .mascot-float, .mascot-eye, .mascot-talk, .mascot-wave { animation: none; }
        }
      `}</style>

            <ellipse cx="100" cy="208" rx="50" ry="6" fill="#14213D" opacity="0.12" />

            <g className="mascot-float">
                <g transform={farewell || sad ? "rotate(-4 100 120)" : undefined}>
                    {/* Mic */}
                    <rect x="88" y="2" width="24" height="38" rx="12" fill="#1F7A8C" />
                    <path d="M79 28 Q79 52 100 52 Q121 52 121 28" stroke="#1F7A8C" strokeWidth="4" strokeLinecap="round" />
                    <path d="M100 52 V58" stroke="#1F7A8C" strokeWidth="4" strokeLinecap="round" />

                    {/* Body */}
                    <rect x="28" y="56" width="144" height="118" rx="44" fill="#14213D" />
                    <path d="M56 166 L44 206 L98 172 Z" fill="#14213D" />

                    {/* Eyes */}
                    {farewell ? (
                        <>
                            {/* Closed, smiling eyes */}
                            <path d="M62 110 Q76 94 90 110" stroke="#FAF8F5" strokeWidth="5" strokeLinecap="round" />
                            <path d="M110 110 Q124 94 138 110" stroke="#FAF8F5" strokeWidth="5" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <g className="mascot-eye">
                                <circle cx="76" cy="106" r="15" fill="#FAF8F5" />
                                <circle cx={sad ? 76 : 79} cy={sad ? 114 : 108} r="7" fill="#14213D" />
                            </g>
                            <g className="mascot-eye">
                                <circle cx="124" cy="106" r="15" fill="#FAF8F5" />
                                <circle cx={sad ? 124 : 127} cy={sad ? 114 : 108} r="7" fill="#14213D" />
                            </g>
                        </>
                    )}

                    {/* Worried brows */}
                    {sad && (
                        <>
                            <path d="M58 94 L90 82" stroke="#FAF8F5" strokeWidth="5" strokeLinecap="round" />
                            <path d="M142 94 L110 82" stroke="#FAF8F5" strokeWidth="5" strokeLinecap="round" />
                        </>
                    )}

                    {/* Cheeks */}
                    <circle cx="58" cy="130" r="9" fill="#FF7A59" opacity={sad ? 0.6 : 0.85} />
                    <circle cx="142" cy="130" r="9" fill="#FF7A59" opacity={sad ? 0.6 : 0.85} />

                    {/* A single tear */}
                    {sad && <path d="M70 124 C76 132 76 139 70 141 C64 139 64 132 70 124Z" fill="#5FC3D4" />}

                    {/* Mouth */}
                    {talking ? (
                        <g className="mascot-talk">
                            <ellipse cx="100" cy="134" rx="13" ry="9" fill="#FAF8F5" />
                            <ellipse cx="100" cy="138" rx="7" ry="4" fill="#FF7A59" />
                        </g>
                    ) : sad ? (
                        <path d="M86 142 Q100 128 114 142" stroke="#FAF8F5" strokeWidth="6" strokeLinecap="round" />
                    ) : farewell ? (
                        <path d="M86 130 Q100 142 114 130" stroke="#FAF8F5" strokeWidth="5" strokeLinecap="round" />
                    ) : (
                        <path d="M84 128 Q100 146 116 128" stroke="#FAF8F5" strokeWidth="6" strokeLinecap="round" />
                    )}

                    {farewell && (
                        <path
                            transform="translate(168 44) scale(1.7)"
                            d="M0 7C-9 0 -9 -8 -3 -8C-1 -8 0 -6 0 -5C0 -6 1 -8 3 -8C9 -8 9 0 0 7Z"
                            fill="#FF7A59"
                        />
                    )}

                    {talking && (
                        <g stroke="#1F7A8C" strokeWidth="5" strokeLinecap="round">
                            <path className="mascot-wave" d="M184 100 Q192 114 184 128" />
                            <path className="mascot-wave mascot-wave-2" d="M192 90 Q199 114 192 138" />
                            <path className="mascot-wave" d="M16 100 Q8 114 16 128" />
                            <path className="mascot-wave mascot-wave-2" d="M8 90 Q1 114 8 138" />
                        </g>
                    )}
                </g>
            </g>
        </svg>
    );
}