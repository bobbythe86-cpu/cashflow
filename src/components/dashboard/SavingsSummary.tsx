'use client'

import { SavingsGoal } from "@/types"
import { Target, ChevronRight } from "lucide-react"
import Link from "next/link"

interface SavingsSummaryProps {
    goals: SavingsGoal[]
}

export function SavingsSummary({ goals }: SavingsSummaryProps) {
    if (goals.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-xs text-muted-foreground italic">Nincsenek aktív céljaid.</p>
                <Link href="/savings" className="text-[10px] text-primary font-bold hover:underline">
                    Állíts be egyet most!
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {goals.map((goal) => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)

                return (
                    <div key={goal.id} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                            <span className="font-bold flex items-center gap-1">
                                <Target className="w-3 h-3" style={{ color: goal.color }} />
                                {goal.name}
                            </span>
                            <span className="text-muted-foreground">{percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${percent}%`, backgroundColor: goal.color }}
                            />
                        </div>
                    </div>
                )
            })}
            <Link
                href="/savings"
                className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors pt-2 group"
            >
                Összes megtakarítás megtekintése
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
        </div>
    )
}
