import { SavingsGoal } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { SavingsDetailsDialog } from './SavingsDetailsDialog'

interface SavingsGoalListProps {
    goals: SavingsGoal[]
}

export function SavingsGoalList({ goals }: SavingsGoalListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {goals.map((goal) => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
                const isComplete = goal.current_amount >= goal.target_amount

                return (
                    <SavingsDetailsDialog key={goal.id} goal={goal}>
                        <Card className="border-none shadow-xl glass overflow-hidden relative group h-full flex flex-col cursor-pointer transition-all hover:scale-[1.01]">
                            {/* Background Image / Overlay */}
                            {goal.image_url && (
                                <div className="absolute inset-0 z-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={goal.image_url} alt={goal.name} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                                </div>
                            )}

                            {/* Status bar atop */}
                            <div
                                className="absolute top-0 left-0 h-1 transition-all duration-1000 z-20"
                                style={{ width: `${percent}%`, backgroundColor: goal.color }}
                            />

                            <CardContent className="p-6 space-y-6 relative z-10 flex-1 flex flex-col">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="p-3 rounded-2xl shadow-lg border border-white/5"
                                            style={{ backgroundColor: goal.image_url ? 'rgba(0,0,0,0.5)' : `${goal.color}20`, color: goal.color }}
                                        >
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black tracking-tight">{goal.name}</h4>
                                            {goal.deadline && (
                                                <p className="text-xs text-muted-foreground">
                                                    Célidő: {format(new Date(goal.deadline), 'yyyy. MMMM dd.', { locale: hu })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span>{percent}% teljesítve</span>
                                        <span className="text-muted-foreground italic font-normal">
                                            {goal.current_amount.toLocaleString()} / {goal.target_amount.toLocaleString()} Ft
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                                            style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                        />
                                    </div>
                                </div>

                                {/* Motivational Message */}
                                {!isComplete && goal.deadline && (
                                    <div className="p-3 bg-secondary/30 rounded-xl border border-white/5 text-xs text-muted-foreground flex items-center gap-2">
                                        <span style={{ color: goal.color }}>💡</span>
                                        <span>
                                            Már csak napi <strong style={{ color: goal.color }}>{Math.round(Math.max((goal.target_amount - goal.current_amount) / Math.max(1, (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)), 0)).toLocaleString()} Ft</strong> kell a célhoz!
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 mt-auto">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider group-hover:text-primary transition-colors">
                                        Részletek kezelése →
                                    </span>

                                    {isComplete && (
                                        <div className="flex items-center gap-1 text-green-500 font-bold text-xs animate-bounce bg-green-500/10 px-2 py-1 rounded-full">
                                            🎉 Megcsináltad!
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </SavingsDetailsDialog>
                )
            })}
        </div>
    )
}
