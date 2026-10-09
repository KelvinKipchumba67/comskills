import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthPage from "@/components/AuthPage";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
    // Already signed in? Go straight to practice.
    if (await getUserId()) redirect("/practice");

    const { mode } = await searchParams;
    return <AuthPage initialMode={mode === "signup" ? "signup" : "signin"} />;
}