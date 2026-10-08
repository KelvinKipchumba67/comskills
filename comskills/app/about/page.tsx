import AboutSections from "@/components/AboutSections";

export const metadata = {
    title: "About | Comskill",
    description: "Comskill is your personal AI speech coach. Practice out loud and get a little better every time.",
};

export default function AboutPage() {
    return (
        <main className="w-full flex-1 bg-[#FAF8F5] font-inter text-[#14213D]">
            <AboutSections />
        </main>
    );
}
