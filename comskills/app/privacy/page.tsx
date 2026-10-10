import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Privacy | Comskill",
    description: "What Comskill collects, why, who processes it, and the choices you have.",
};
const PROCESSORS = [
    {
        name: "Supabase",
        what: "Holds your account, our database, and the private storage where your saved recordings live.",
    },
    {
        name: "AssemblyAI",
        what: "Receives the audio of a recording when you choose to analyze it, and sends back a transcript with word timings. We delete the transcript from AssemblyAI once we have received it.",
    },
    {
        name: "An AI coaching service (currently OpenRouter or Groq)",
        what: "Receives the transcript and the speaking measurements of an analyzed recording, and returns the written coaching. It does not receive your video.",
    },
    {
        name: "Google and Facebook",
        what: "Only if you choose to sign in with them. They tell us your name and email address.",
    },
    {
        name: "Google Fonts",
        what: "Delivers the typefaces on this site, so your browser contacts Google when a page loads.",
    },
];

const contact = LEGAL.email ? (
    <>
        email <a className="font-semibold text-[#1F7A8C] underline underline-offset-4" href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
    </>
) : (
    <>
        use the <Link className="font-semibold text-[#1F7A8C] underline underline-offset-4" href="/contact">Contact page</Link>
    </>
);

const sections: LegalSection[] = [
    {
        id: "collect",
        heading: "What we collect",
        body: (
            <>
                <ul>
                    <li>
                        <strong>Account details.</strong> Your name and email address. If you sign up with a password, it is
                        handled by our sign in provider and we never see or store it in plain text. If you use Google or
                        Facebook, they share your name and email with us.
                    </li>
                    <li>
                        <strong>Recordings you save.</strong> The video file, plus its length, size and the time you saved it.
                        Nothing is uploaded until you press Save.
                    </li>
                    <li>
                        <strong>Analysis of a recording.</strong> If you choose to analyze one, we keep the transcript, the
                        measurements (pace, filler words, pauses) and the written coaching, so you can see them again.
                    </li>
                    <li>
                        <strong>Your progress.</strong> Which lessons you have completed.
                    </li>
                    <li>
                        <strong>A sign in cookie.</strong> A small file that keeps you signed in. We do not use advertising or
                        tracking cookies.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "camera",
        heading: "Your camera and microphone",
        body: (
            <p>
                Your browser asks for permission before Comskill can use your camera and microphone, and you can turn that
                permission off at any time in your browser settings. While you record, the video stays on your device. If you
                discard a take, it is gone and was never uploaded.
            </p>
        ),
    },
    {
        id: "use",
        heading: "How we use it",
        body: (
            <>
                <p>We use your information to:</p>
                <ul>
                    <li>run your account and keep you signed in,</li>
                    <li>store your recordings and let you play them back,</li>
                    <li>analyze a recording when you ask us to, and show you the results and your progress over time, and</li>
                    <li>keep the service secure and fix problems.</li>
                </ul>
                <p>We do not sell your information, and we do not use it for advertising.</p>
            </>
        ),
    },
    {
        id: "services",
        heading: "Who else handles your data",
        body: (
            <>
                <p>
                    We use outside services to run Comskill. They handle your data only to do their job for us, and only the
                    parts listed here.
                </p>
                <ul>
                    {PROCESSORS.map((p) => (
                        <li key={p.name}>
                            <strong>{p.name}.</strong> {p.what}
                        </li>
                    ))}
                </ul>
                <p>
                    Some of these services are based in other countries, so your information may be processed outside the
                    country where you live.
                </p>
            </>
        ),
    },
    {
        id: "keep",
        heading: "How long we keep it",
        body: (
            <>
                <p>
                    Your recordings are private to your account, and the links used to play them expire after an hour. We keep
                    your recordings and their analysis until you delete them.
                </p>
                <p>
                    To delete a recording, open it from My recordings and choose Delete. That removes the video file and its
                    analysis. To delete your whole account and everything in it, {contact}.
                </p>
            </>
        ),
    },
    {
        id: "rights",
        heading: "Your choices",
        body: (
            <>
                <p>
                    Depending on where you live, you may have the right to ask what we hold about you, to have it corrected or
                    deleted, to object to how we use it, or to get a copy. To make a request, {contact}.
                </p>
                <p>We will answer as soon as we reasonably can.</p>
            </>
        ),
    },
    {
        id: "security",
        heading: "Keeping it safe",
        body: (
            <p>
                Recordings sit in private storage, and each person can reach only their own. We take sensible steps to protect
                your information, but no service can promise perfect security.
            </p>
        ),
    },
    {
        id: "children",
        heading: "Young people",
        body: (
            <p>
                Comskill is meant for adults and older teenagers. If you are under 18, please use it with a parent or
                guardian&apos;s permission.
            </p>
        ),
    },
    {
        id: "changes",
        heading: "Changes to this policy",
        body: (
            <p>
                If we change how we handle your information, we will update this page and the date at the top. For a big
                change, we will tell you in the app.
            </p>
        ),
    },
    {
        id: "contact",
        heading: "Contact us",
        body: <p>Questions about this policy or your information? Please {contact}.</p>,
    },
];

export default function PrivacyPage() {
    return (
        <LegalPage
            title="Privacy"
            updated={LEGAL.updated}
            intro={
                <p>
                    This page explains what Comskill collects when you use it, why, and what you can do about it. We have tried
                    to keep it plain.
                </p>
            }
            summary={{
                heading: "The short version",
                points: [
                    "We keep your account details, and the recordings you choose to save.",
                    "A recording is analyzed only when you ask for it.",
                    "Your recordings are private to you, and you can delete them whenever you like.",
                    "We don't sell your information or use it for ads.",
                ],
            }}
            sections={sections}
        />
    );
}