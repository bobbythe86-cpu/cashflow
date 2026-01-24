import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { getProfile } from "@/actions/profile"
import { ChangelogBanner } from "@/components/ChangelogBanner"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const profile = await getProfile()

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar role={profile?.role} />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <ChangelogBanner />
                <main className="p-8 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
