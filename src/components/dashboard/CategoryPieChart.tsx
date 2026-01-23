'use client'

import { Transaction } from "@/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface CategoryPieChartProps {
    transactions: Transaction[]
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899']

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
    // Aggregate data by category
    const data = transactions.reduce((acc, curr) => {
        const categoryName = curr.category?.name || 'Egyéb'
        const existing = acc.find(item => item.name === categoryName)
        if (existing) {
            existing.value += curr.amount
        } else {
            acc.push({ name: categoryName, value: curr.amount })
        }
        return acc
    }, [] as { name: string; value: number }[])
        .sort((a, b) => b.value - a.value)

    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Nincs adat a megjelenítéshez</div>
    }

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `${value.toLocaleString()} Ft`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
