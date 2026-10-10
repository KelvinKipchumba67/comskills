import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
    title: "Terms | Comskill",
    description: "The rules for using Comskill.",
};

const link = "font-semibold text-[#1F7A8C] underline underline-offset-4";

const contact = LEGAL.email ? (
    <>
        email{" "}
        <a className={link} href={`mailto:${LEGAL.email}`}>
            {LEGAL.email}
        </a>
    </>
) : (
    <>
        use the{" "}
        <Link className={link} href="/contact">
            Contact page
        </Link>
    </>
);

const sections: LegalSection[] = [
    {
        id: "agree",
        heading: "Using Comskill",
        body: (
            <p>
                By creating an account or using Comskill, you agree to these terms and to our{" "}
                <Link className={link} href="/privacy">
                    Privacy page
                </Link>
                . If you do not agree, please do not use the service.
            </p>
        ),
    },
    {
        id: "account",
        heading: "Your account",
        body: (
            <ul>
                <li>Give us accurate details when you sign up.</li>
                <li>Keep your password private. You are responsible for what happens under your account.</li>
                <li>Each account is for one person. Please do not share it.</li>
                <li>
                    If you think someone else has got into your account, tell us straight away: {contact}.
                </li>
            </ul>
        ),
    },
    {
        id: "content",
        heading: "Your recordings",
        body: (
            <>
                <p>
                    Your recordings are yours. We do not claim ownership of them. When you save or analyze one, you give us
                    permission to store it and to process it, including through the services named on our Privacy page, for
                    the sole purpose of running Comskill for you.
                </p>
                <p>
                    Only record yourself. If other people appear or can be heard, make sure you have their permission, and do
                    not record private conversations without the consent of everyone in them.
                </p>
            </>
        ),
    },
    {
        id: "use",
        heading: "What not to do",
        body: (
            <>
                <p>Please do not:</p>
                <ul>
                    <li>use Comskill to break the law or to harm, harass or deceive anyone,</li>
                    <li>save content you have no right to use, or content that is abusive or unlawful,</li>
                    <li>try to get into other people&apos;s accounts or recordings,</li>
                    <li>probe, overload or interfere with the service, or use bots to scrape it, or</li>
                    <li>upload anything meant to damage the service or other people&apos;s devices.</li>
                </ul>
            </>
        ),
    },
    {
        id: "feedback",
        heading: "About the feedback",
        body: (
            <>
                <p>
                    The feedback in Comskill is produced automatically. It is meant to help you practice, and it is general
                    guidance, not professional advice.
                </p>
                <p>
                    Transcripts and measurements can contain mistakes, for example when a recording is noisy or an accent is
                    misheard, and the written coaching comes from an AI, so it can be wrong or miss something. Please use
                    your own judgment. We cannot promise any particular result from using Comskill.
                </p>
            </>
        ),
    },
    {
        id: "service",
        heading: "The service itself",
        body: (
            <p>
                We are always improving Comskill, so features may change, move or be removed. The service may sometimes be
                unavailable, for example during maintenance or when a service we rely on has a problem. We may also set
                limits on use to keep it working for everyone.
            </p>
        ),
    },
    {
        id: "ending",
        heading: "Ending your use",
        body: (
            <>
                <p>
                    You can stop using Comskill at any time, and delete your recordings from the app. To close your account,{" "}
                    {contact}.
                </p>
                <p>
                    We may suspend or close an account that breaks these terms or puts the service or other people at risk.
                </p>
            </>
        ),
    },
    {
        id: "liability",
        heading: "Our responsibility",
        body: (
            <>
                <p>
                    Comskill is provided as it is, and we do not promise it will always be available or free of errors. To
                    the extent the law allows, we are not responsible for losses that come from using, or being unable to use,
                    the service, including lost recordings or progress. Please keep a copy of anything you cannot afford to
                    lose.
                </p>
                <p>Nothing in these terms limits rights you have under the law that cannot be limited.</p>
            </>
        ),
    },
    ...(LEGAL.governingLaw
        ? [
            {
                id: "law",
                heading: "Governing law",
                body: <p>These terms are governed by the laws of {LEGAL.governingLaw}.</p>,
            },
        ]
        : []),
    {
        id: "changes",
        heading: "Changes to these terms",
        body: (
            <p>
                We may update these terms from time to time. When we do, we will change the date at the top, and for a big
                change we will tell you in the app. If you keep using Comskill after a change, you accept the new terms.
            </p>
        ),
    },
    {
        id: "contact",
        heading: "Contact us",
        body: <p>Questions about these terms? Please {contact}.</p>,
    },
];

export default function TermsPage() {
    return (
        <LegalPage
            title="Terms"
            updated={LEGAL.updated}
            intro={<p>These are the rules for using Comskill. They are short, and we have tried to keep them fair.</p>}
            sections={sections}
        />
    );
}