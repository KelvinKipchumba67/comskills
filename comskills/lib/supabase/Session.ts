import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages that need an account. Add any other signed-in-only page here.
// A path matches itself and anything under it, so "/practice" also covers "/practice/anything".
const PROTECTED = ["/practice", "/recordings", "/learning", "/dashboard", "/analytics"];

// Keeps the login alive and blocks signed-out visitors from the app pages.
// Access tokens expire after about an hour, and this refreshes them on every request
// so people don't get signed out in the middle of a session.
export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const needsAccount = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));

    if (!user && needsAccount) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth";
        url.search = "?mode=signup";
        const redirect = NextResponse.redirect(url);
        response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
        return redirect;
    }

    return response;
}