"use client";

// Shows the date in the viewer's own timezone (the server's would be wrong for most users).
export default function LocalTime({ iso }: { iso: string }) {
    return (
        <time dateTime={iso} suppressHydrationWarning>
            {new Date(iso).toLocaleString(undefined, {
                day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
            })}
        </time>
    );
}