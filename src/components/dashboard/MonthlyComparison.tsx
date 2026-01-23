'use client'

import { Transaction } from "@/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, startOfMonth, parseISO } from "date-fns"
import { hu } from 'date-fns/locale'

interface MonthlyComparisonProps {
    transactions: Transaction[]
}

export function MonthlyComparison({ transactions }: MonthlyComparisonProps) {
    // Aggregate data by month
    const data = transactions.reduce((acc, curr) => {
        const month = format(new Date(curr.date), 'MMMM', { locale: hu })
        const existing = acc.find(item => item.name === month)
        if (existing) {
            if (curr.type === 'income') existing.bevétel += curr.amount
            else existing.kiadás += curr.amount
        } else {
            acc.push({
                name: month,
                bevétel: curr.type === 'income' ? curr.amount : 0,
                kiadás: curr.type === 'expense' ? curr.amount : 0
            })
        }
        return acc
    }, [] as { name: string; bevétel: number; kiadás: number }[])
        .reverse() // Correct order for recent months

    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Nincs adat a megjelenítéshez</div>
    }

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number) => `${value.toLocaleString()} Ft`}
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                    <Bar name="Bevétel" dataKey="bevétel" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar name="Kiadás" dataKey="kiadás" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
