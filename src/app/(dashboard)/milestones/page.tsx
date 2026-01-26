import { getMilestones } from "@/actions/milestones"
import { MilestoneList } from "@/components/dashboard/MilestoneList"
import { Trophy } from "lucide-react"

export const metadata = {
    title: 'Mérföldkövek | CashFlow',
    description: 'Kövesd nyomon a pénzügyi céljaid és elért eredményeid.',
}

export default async function MilestonesPage() {
    const milestones = await getMilestones()

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-amber-500" />
                        Mérföldkövek
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Teljesíts kihívásokat és kövesd a pénzügyi fejlődésed!
                    </p>
                </div>
            </div>

            <div className="h-full flex-1 flex-col space-y-8 flex">
                <MilestoneList milestones={milestones} />
            </div>
        </div>
    )
}
