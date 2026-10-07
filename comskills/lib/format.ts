export const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const formatSize = (bytes: number) =>
    bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;


export function formatTotal(seconds: number) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.round(seconds / 60);
    return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
}