type MascotProps = {
    mood?: "happy" | "talking";
    size?: number; // width in px, set directly so the size never depends on generated CSS
    className?: string;
    title?: string;
};

// Echo: a speech bubble with a mic on top, the same two shapes as the Comskill logo.
export default function Mascot({
                                   mood = "happy",
                                   size = 240,
                                   className = "",
                                   title = "Echo, the Comskill mascot",
                               }: MascotProps) {
    const talking = mood === "talking";

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

            {/* Ground shadow stays put while the body floats */}
            <ellipse cx="100" cy="208" rx="50" ry="6" fill="#14213D" opacity="0.12" />

            <g className="mascot-float">
                {/* Mic */}
                <rect x="88" y="2" width="24" height="38" rx="12" fill="#1F7A8C" />
                <path d="M79 28 Q79 52 100 52 Q121 52 121 28" stroke="#1F7A8C" strokeWidth="4" strokeLinecap="round" />
                <path d="M100 52 V58" stroke="#1F7A8C" strokeWidth="4" strokeLinecap="round" />

                {/* Body */}
                <rect x="28" y="56" width="144" height="118" rx="44" fill="#14213D" />
                <path d="M56 166 L44 206 L98 172 Z" fill="#14213D" />

                {/* Eyes */}
                <g className="mascot-eye">
                    <circle cx="76" cy="106" r="15" fill="#FAF8F5" />
                    <circle cx="79" cy="108" r="7" fill="#14213D" />
                </g>
                <g className="mascot-eye">
                    <circle cx="124" cy="106" r="15" fill="#FAF8F5" />
                    <circle cx="127" cy="108" r="7" fill="#14213D" />
                </g>

                {/* Cheeks */}
                <circle cx="58" cy="130" r="9" fill="#FF7A59" opacity="0.85" />
                <circle cx="142" cy="130" r="9" fill="#FF7A59" opacity="0.85" />

                {/* Mouth */}
                {talking ? (
                    <g className="mascot-talk">
                        <ellipse cx="100" cy="134" rx="13" ry="9" fill="#FAF8F5" />
                        <ellipse cx="100" cy="138" rx="7" ry="4" fill="#FF7A59" />
                    </g>
                ) : (
                    <path d="M84 128 Q100 146 116 128" stroke="#FAF8F5" strokeWidth="6" strokeLinecap="round" />
                )}

                {/* Sound waves while talking */}
                {talking && (
                    <g stroke="#1F7A8C" strokeWidth="5" strokeLinecap="round">
                        <path className="mascot-wave" d="M184 100 Q192 114 184 128" />
                        <path className="mascot-wave mascot-wave-2" d="M192 90 Q199 114 192 138" />
                        <path className="mascot-wave" d="M16 100 Q8 114 16 128" />
                        <path className="mascot-wave mascot-wave-2" d="M8 90 Q1 114 8 138" />
                    </g>
                )}
            </g>
        </svg>
    );
}