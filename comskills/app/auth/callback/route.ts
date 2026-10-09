import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/Server";
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    const rawNext = searchParams.get("next") ?? "/practice";
    const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/practice";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocal = process.env.NODE_ENV === "development";
            if (!isLocal && forwardedHost) return NextResponse.redirect(`https://${forwardedHost}${next}`);
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(`${origin}/auth?error=oauth`);
}