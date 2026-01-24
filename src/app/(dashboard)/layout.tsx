import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { getProfile } from "@/actions/profile"
import { ChangelogBanner } from "@/components/ChangelogBanner"
import { MobileNav } from "@/components/layout/MobileNav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getProfile()

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <Sidebar role={profile?.role} />
            <div className="flex-1 flex flex-col relative z-10">
                <Navbar />
                <ChangelogBanner />
                <main className="p-4 sm:p-8 pb-32 lg:pb-8 flex-1 overflow-y-auto">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    )
}
