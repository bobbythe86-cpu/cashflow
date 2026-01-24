'use client'

import { useState } from 'react'
import { SavingsGoal } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Trash2, Plus, Minus } from 'lucide-react'
import { updateSavingsAmount, deleteSavingsGoal } from '@/actions/savings'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

interface SavingsGoalListProps {
    goals: SavingsGoal[]
}

export function SavingsGoalList({ goals }: SavingsGoalListProps) {
    const [updating, setUpdating] = useState<string | null>(null)

    async function handleUpdateAmount(id: string, current: number, delta: number) {
        const next = Math.max(0, current + delta)
        setUpdating(id)
        const result = await updateSavingsAmount(id, next)
        if (result.error) alert(result.error)
        setUpdating(null)
    }

    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a célt?')) {
            await deleteSavingsGoal(id)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {goals.map((goal) => {
                const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)
                const isComplete = goal.current_amount >= goal.target_amount

                return (
                    <Card key={goal.id} className="border-none shadow-xl glass overflow-hidden relative group">
                        {/* Status bar atop */}
                        <div
                            className="absolute top-0 left-0 h-1 transition-all duration-1000"
                            style={{ width: `${percent}%`, backgroundColor: goal.color }}
                        />

                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="p-3 rounded-2xl"
                                        style={{ backgroundColor: `${goal.color}20`, color: goal.color }}
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(goal.id)}
                                    className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>{percent}% teljesítve</span>
                                    <span className="text-muted-foreground italic font-normal">
                                        {goal.current_amount.toLocaleString()} / {goal.target_amount.toLocaleString()} Ft
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${percent}%`, backgroundColor: goal.color }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg"
                                        disabled={updating === goal.id}
                                        onClick={() => handleUpdateAmount(goal.id, goal.current_amount, -10000)}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg"
                                        disabled={updating === goal.id}
                                        onClick={() => handleUpdateAmount(goal.id, goal.current_amount, 10000)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-[10px] text-muted-foreground ml-2">+/- 10k Ft</span>
                                </div>

                                {isComplete && (
                                    <div className="flex items-center gap-1 text-green-500 font-bold text-xs animate-bounce">
                                        🎉 Megcsináltad!
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
