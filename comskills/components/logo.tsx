import { Mic, MessageSquare } from "lucide-react";

type LogoProps = {
    showTagline?: boolean; // the coral line under the wordmark
    iconOnly?: boolean; // mic + bubble only (collapsed sidebar)
};

// Same markup as the landing page logo. Layout/positioning belongs to whoever renders <Logo />.
export default function Logo({ showTagline = true, iconOnly = false }: LogoProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center">
                <div className={`relative flex items-center justify-center h-8 w-8 ${iconOnly ? "" : "mr-2"}`}>
                    <Mic className="text-[#1F7A8C] h-6 w-6 absolute bottom-0 left-0" strokeWidth={2.5} />
                    <MessageSquare className="text-[#14213D] h-4 w-4 absolute top-0 right-0 fill-current" />
                </div>
                {!iconOnly && (
                    <span className="text-2xl font-sora font-bold text-[#14213D] tracking-tight">comskill</span>
                )}
            </div>
            {showTagline && !iconOnly && (
                <p className="text-[#FF7A59] text-[10px] font-bold uppercase tracking-wider mt-1 ml-1 font-inter">
                    Changing lives one practice at a time
                </p>
            )}
        </div>
    );
}