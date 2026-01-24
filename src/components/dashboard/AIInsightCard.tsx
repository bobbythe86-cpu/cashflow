'use client'

import { Insight } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIInsightCardProps {
    insights: Insight[]
}

export function AIInsightCard({ insights }: AIInsightCardProps) {
    if (insights.length === 0) return null

    const typeIcons = {
        info: Lightbulb,
        warning: AlertTriangle,
        success: Sparkles,
        trend: TrendingUp
    }

    const typeColors = {
        info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        success: "text-green-500 bg-green-500/10 border-green-500/20",
        trend: "text-purple-500 bg-purple-500/10 border-purple-500/20"
    }

    return (
        <Card className="border-none shadow-xl glass overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-primary animate-pulse" />
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">AI Tanácsadó</CardTitle>
                        <CardDescription>Okos észrevételek a pénzügyeidről</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {insights.map((insight, index) => {
                    const Icon = typeIcons[insight.type]
                    return (
                        <div
                            key={insight.id}
                            className={cn(
                                "p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] animate-in slide-in-from-right",
                                typeColors[insight.type]
                            )}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="flex gap-4">
                                <div className="shrink-0 pt-1">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-bold text-sm leading-none">{insight.title}</h5>
                                    <p className="text-xs opacity-80 leading-relaxed">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {insights.length > 0 && (
                    <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 group">
                        További elemzések megnyitása
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </CardContent>
        </Card>
    )
}
