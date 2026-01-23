'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, Area, AreaChart, CartesianGrid } from "recharts"

interface OverviewChartProps {
    data: { date: string; amount: number; type: string }[]
}

export function OverviewChart({ data }: OverviewChartProps) {
    // Aggregate data by date
    const aggregatedData = data.reduce((acc, curr) => {
        const existing = acc.find(a => a.date === curr.date)
        if (existing) {
            if (curr.type === 'income') existing.income += curr.amount
            else existing.expense += curr.amount
        } else {
            acc.push({
                date: curr.date,
                income: curr.type === 'income' ? curr.amount : 0,
                expense: curr.type === 'expense' ? curr.amount : 0,
            })
        }
        return acc
    }, [] as { date: string; income: number; expense: number }[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aggregatedData}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value} Ft`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`${value.toLocaleString()} Ft`]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                        name="Bevétel"
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        strokeWidth={2}
                    />
                    <Area
                        name="Kiadás"
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
