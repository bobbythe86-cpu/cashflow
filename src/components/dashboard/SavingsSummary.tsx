'use client'

import { SavingsGoal } from "@/types"
import { Target } from "lucide-react"
import Link from "next/link"
import { SavingsDetailsDialog } from "@/components/dashboard/SavingsDetailsDialog"

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
                const remaining = goal.target_amount - goal.current_amount
                const daysRemaining = goal.deadline ? Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 30
                const dailyNeeded = Math.round(Math.max(remaining / daysRemaining, 0))

                return (
                    <SavingsDetailsDialog key={goal.id} goal={goal}>
                        <div className="relative overflow-hidden rounded-2xl border shadow-lg group h-40 flex flex-col justify-end transition-all hover:scale-[1.02] cursor-pointer">
                            {goal.image_url ? (
                                <div className="absolute inset-0 z-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={goal.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 z-0 bg-gradient-to-br from-background to-secondary" />
                            )}

                            <div className="relative z-10 p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-extrabold text-lg tracking-tight leading-none mb-1 flex items-center gap-2">
                                            {goal.name}
                                        </h4>
                                        <p className="text-xs font-medium text-muted-foreground bg-background/50 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">
                                            {goal.current_amount.toLocaleString()} / {goal.target_amount.toLocaleString()} Ft
                                        </p>
                                    </div>
                                    <div className="bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg font-bold text-xs border shadow-sm">
                                        {percent}%
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="h-2.5 w-full bg-secondary/50 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                            style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                        />
                                    </div>
                                    {percent < 100 && (
                                        <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-green-500" />
                                            Még napi <strong className="text-foreground">{dailyNeeded.toLocaleString()} Ft</strong> a célhoz!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SavingsDetailsDialog>
                )
            })}
            <Link
                href="/savings"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted hover:border-primary hover:bg-primary/5 transition-all h-40 group text-muted-foreground hover:text-primary"
            >
                <div className="p-3 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                    <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Összes cél</span>
            </Link>
        </div>
    )
}
