'use client'

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface ForecastChartProps {
    data: any[]
}

export function ForecastChart({ data }: ForecastChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="label"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000).toLocaleString()}k`}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-3 shadow-xl glass">
                                        <p className="text-sm font-bold mb-2">{payload[0].payload.label}</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-muted-foreground">Várható egyenleg:</span>
                                                <span className="text-sm font-black text-primary">
                                                    {payload[0].value?.toLocaleString()} Ft
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-muted-foreground">Tervezett bevétel:</span>
                                                <span className="text-xs font-bold text-green-500">
                                                    +{payload[0].payload.income?.toLocaleString()} Ft
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-xs text-muted-foreground">Tervezett kiadás:</span>
                                                <span className="text-xs font-bold text-red-500">
                                                    -{payload[0].payload.expenses?.toLocaleString()} Ft
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="balance"
                        stroke="hsl(var(--primary))"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorBalance)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
