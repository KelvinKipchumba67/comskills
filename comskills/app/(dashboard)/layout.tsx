import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen h-dvh w-full bg-[#FAF8F5] text-[#14213D]">
            <Sidebar />
            <main className="min-w-0 flex-1 overflow-y-auto py-5 pl-2 pr-8 max-md:p-4">{children}</main>
        </div>
    );
}