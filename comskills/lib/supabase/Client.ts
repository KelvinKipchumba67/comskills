import { createBrowserClient } from "@supabase/ssr";

// Used in client components (the sign in form and the navbar button).
// The anon key is safe to expose; never put the service role key here.
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}