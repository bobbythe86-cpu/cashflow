'use client'

import { useState } from 'react'
import { Category, Budget } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { upsertBudget } from '@/actions/budgets'
import { Save, Check } from 'lucide-react'

interface BudgetListProps {
    categories: Category[]
    budgets: Budget[]
    month: number
    year: number
}

export function BudgetList({ categories, budgets, month, year }: BudgetListProps) {
    const [values, setValues] = useState<Record<string, number>>(
        budgets.reduce((acc, b) => ({ ...acc, [b.category_id]: b.amount }), {})
    )
    const [saving, setSaving] = useState<string | null>(null)
    const [saved, setSaved] = useState<string | null>(null)

    async function handleSave(categoryId: string) {
        const amount = values[categoryId] || 0
        setSaving(categoryId)

        const result = await upsertBudget(categoryId, amount, month, year)

        if (result.success) {
            setSaved(categoryId)
            setTimeout(() => setSaved(null), 2000)
        } else {
            alert('Hiba történt: ' + result.error)
        }

        setSaving(null)
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 glass rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color || '#ccc' }} />
                            <span className="font-medium">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Input
                                    type="number"
                                    className="w-32 h-9 text-right pr-8"
                                    value={values[cat.id] || 0}
                                    onChange={(e) => setValues({ ...values, [cat.id]: parseFloat(e.target.value) || 0 })}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase font-bold">Ft</span>
                            </div>
                            <Button
                                size="sm"
                                variant={saved === cat.id ? "default" : "outline"}
                                className="h-9 w-9 p-0"
                                onClick={() => handleSave(cat.id)}
                                disabled={saving === cat.id}
                            >
                                {saved === cat.id ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            {categories.length === 0 && (
                <p className="text-center py-8 text-muted-foreground italic">Előbb adj hozzá kiadás kategóriákat!</p>
            )}
        </div>
    )
}
