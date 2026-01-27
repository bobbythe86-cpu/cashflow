import { getSavingsGoals } from "@/actions/savings"
import { SavingsGoalList } from "@/components/dashboard/SavingsGoalList"
import { AddSavingsGoalDialog } from "@/components/dashboard/AddSavingsGoalDialog"
import { SavingsCalculators } from "@/components/dashboard/SavingsCalculators"
import { Target } from "lucide-react"

export default async function SavingsPage() {
    const goals = await getSavingsGoals()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Megtakarítási Célok</h2>
                    <p className="text-muted-foreground">Tervezz előre és érd el az álmaidat szisztematikusan.</p>
                </div>
                <AddSavingsGoalDialog />
            </div>

            <SavingsCalculators />

            {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl border-2 border-dashed border-white/10 text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Target className="w-12 h-12 text-primary/40" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Még nincsenek céljaid</h3>
                        <p className="text-muted-foreground max-w-md">Adj hozzá egy új célt, például &quot;Tartalék alap&quot; vagy &quot;Új autó&quot;, és kezdd el követni a haladásodat.</p>
                    </div>
                </div>
            ) : (
                <SavingsGoalList goals={goals} />
            )}
        </div>
    )
}
