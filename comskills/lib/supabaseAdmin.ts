import { createClient } from "@supabase/supabase-js";

// Server only. The service role key bypasses all access rules, so never expose it to the browser.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const RECORDINGS_BUCKET = "recordings";