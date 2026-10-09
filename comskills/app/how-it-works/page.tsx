import type { Metadata } from "next";
import HowItWorks from "@/components/HowItWorks";

// Not linked anywhere except the landing page button, and kept out of search results.
export const metadata: Metadata = {
    title: "How Comskill works",
    robots: { index: false, follow: false },
};

export default function Page() {
    return <HowItWorks />;
}