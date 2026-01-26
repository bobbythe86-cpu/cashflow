'use client'

import { MilestoneWithProgress } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Zap, PiggyBank, PieChart, Trophy, Star, Target, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface MilestoneListProps {
    milestones: MilestoneWithProgress[]
}

export function MilestoneList({ milestones }: MilestoneListProps) {
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Zap': return <Zap className="w-5 h-5 text-yellow-500" />;
            case 'PiggyBank': return <PiggyBank className="w-5 h-5 text-pink-500" />;
            case 'PieChart': return <PieChart className="w-5 h-5 text-blue-500" />;
            case 'Trophy': return <Trophy className="w-5 h-5 text-amber-500" />;
            default: return <Star className="w-5 h-5 text-gray-500" />;
        }
    }

    if (milestones.length === 0) {
        return (
            <div className="text-center py-10">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                <h3 className="text-lg font-medium text-muted-foreground">Még nincsenek elérhető mérföldkövek</h3>
                <p className="text-sm text-muted-foreground/80">Használd aktívan az alkalmazást, hogy feloldd őket!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map((milestone) => {
                const percent = Math.min(100, Math.max(0, (milestone.progress / milestone.target_value) * 100))

                return (
                    <Card
                        key={milestone.id}
                        className={cn(
                            "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2",
                            milestone.is_achieved
                                ? "border-amber-400/50 bg-amber-50/10 dark:bg-amber-950/10"
                                : "hover:border-primary/50"
                        )}
                    >
                        {milestone.is_achieved && (
                            <div className="absolute top-0 right-0 p-2">
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 hover:bg-amber-200 gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Teljesítve
                                </Badge>
                            </div>
                        )}

                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className={cn(
                                "p-3 rounded-full bg-secondary transition-colors",
                                milestone.is_achieved && "bg-amber-100 dark:bg-amber-900/30"
                            )}>
                                {getIcon(milestone.icon)}
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base font-bold leading-none">
                                    {milestone.name}
                                </CardTitle>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                    {milestone.category}
                                </p>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                                {milestone.description}
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span>{milestone.progress} / {milestone.target_value}</span>
                                    <span className={cn(
                                        milestone.is_achieved ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
                                    )}>
                                        {Math.round(percent)}%
                                    </span>
                                </div>
                                <Progress
                                    value={percent}
                                    className={cn(
                                        "h-2",
                                        milestone.is_achieved && "[&>div]:bg-amber-500"
                                    )}
                                />
                            </div>
                        </CardContent>

                        {/* Shine effect for achieved milestones */}
                        {milestone.is_achieved && (
                            <div className="absolute inset-0 z-[-1] opacity-20 bg-gradient-to-br from-amber-200/0 via-amber-200/50 to-amber-200/0 dark:from-amber-800/0 dark:via-amber-800/10 dark:to-amber-800/0 pointer-events-none" />
                        )}
                    </Card>
                )
            })}
        </div>
    )
}
