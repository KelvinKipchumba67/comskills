import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Used in server components and API routes. Reads the signed-in session from cookies.
export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
                    } catch {
                        // Server components can't set cookies. The proxy.ts file refreshes the session instead.
                    }
                },
            },
        },
    );
}