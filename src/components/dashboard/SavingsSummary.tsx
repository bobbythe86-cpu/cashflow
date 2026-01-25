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
                    <div key={goal.id} className="relative overflow-hidden rounded-xl border group">
                        {goal.image_url && (
                            <div className="absolute inset-0 z-0 opacity-20">
                                <img src={goal.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="relative z-10 p-3 space-y-2 bg-background/50 backdrop-blur-sm">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-extrabold flex items-center gap-1.5 text-sm">
                                    <div className="p-1 rounded bg-background/80 shadow-sm" style={{ color: goal.color }}>
                                        <Target className="w-3.5 h-3.5" />
                                    </div>
                                    {goal.name}
                                </span>
                                <span className="font-bold text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded text-[10px]">{percent}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 shadow-sm"
                                    style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                />
                            </div>
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
