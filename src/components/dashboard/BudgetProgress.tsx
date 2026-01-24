'use client'

import { Budget } from '@/types'
import { cn } from '@/lib/utils'

interface BudgetProgressProps {
    budgets: Budget[]
    monthlyExpensesByCategory: Record<string, number>
}

export function BudgetProgress({ budgets, monthlyExpensesByCategory }: BudgetProgressProps) {
    if (budgets.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground text-sm italic">
                Nincsenek beállítva havi keretek.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {budgets.map((budget) => {
                const spent = monthlyExpensesByCategory[budget.category_id] || 0
                const percent = Math.min(Math.round((spent / budget.amount) * 100), 100)
                const isOver = spent > budget.amount

                return (
                    <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: budget.category?.color || '#ccc' }} />
                                {budget.category?.name}
                            </span>
                            <span className={cn(isOver ? "text-red-500 font-bold" : "text-muted-foreground")}>
                                {spent.toLocaleString()} / {budget.amount.toLocaleString()} Ft
                            </span>
                        </div>
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted/20">
                            <div
                                className={cn(
                                    "h-full transition-all duration-500 ease-in-out rounded-full",
                                    isOver ? "bg-red-500" : percent > 80 ? "bg-yellow-500" : "bg-primary"
                                )}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        {isOver && (
                            <p className="text-[10px] text-red-400 font-bold animate-pulse">
                                Túllépted a keretet {Math.abs(budget.amount - spent).toLocaleString()} Ft-tal!
                            </p>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
