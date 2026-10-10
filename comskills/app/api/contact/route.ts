import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/Server";

const TOPICS: Record<string, string> = {
    general: "General question",
    problem: "Something isn't working",
    privacy: "Account or privacy request",
    feedback: "Feedback or idea",
};

const hits = new Map<string, number[]>();
function tooMany(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
    if (recent.length >= 5) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    return false;
}

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return bad("That didn't look right. Please try again.");
    }
    if (typeof body.website === "string" && body.website.trim() !== "") {
        return NextResponse.json({ ok: true });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const topic = String(body.topic ?? "");
    const message = String(body.message ?? "").trim();

    if (name.length < 1 || name.length > 100) return bad("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return bad("Please enter a valid email address.");
    if (!(topic in TOPICS)) return bad("Please choose a topic.");
    if (message.length < 10) return bad("Please write a little more so we can help.");
    if (message.length > 2000) return bad("Please keep your message under 2000 characters.");

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    if (tooMany(ip)) return bad("You've sent a few messages already. Please try again later.", 429);

    // If they are signed in, note who it came from. It helps with account requests.
    let userId: string | null = null;
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        userId = user?.id ?? null;
    } catch {
        userId = null;
    }

    try {
        await prisma.contactMessage.create({ data: { userId, name, email, topic, message } });
    } catch (e) {
        console.error("contact: could not save message", e instanceof Error ? e.message : e);
        return bad("We couldn't send your message. Please try again in a moment.", 500);
    }
    const key = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    if (key && to) {
        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    from: process.env.CONTACT_FROM_EMAIL || "Comskill <onboarding@resend.dev>",
                    to: [to],
                    reply_to: email,
                    subject: `[Comskill] ${TOPICS[topic]}: ${name.replace(/[\r\n]+/g, " ")}`,
                    text: `From: ${name} <${email}>\nTopic: ${TOPICS[topic]}\n${userId ? `Account id: ${userId}\n` : ""}\n${message}`,
                }),
            });
            if (!res.ok) console.error("contact: email alert failed with status", res.status);
        } catch (e) {
            console.error("contact: email alert failed", e instanceof Error ? e.message : e);
        }
    }

    return NextResponse.json({ ok: true });
}