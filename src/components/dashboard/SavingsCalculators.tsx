'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Flame, ShieldAlert, TrendingUp, Calendar, ArrowRight, PiggyBank } from "lucide-react"
import { getFIREData, getEmergencyFundRecommendation } from "@/actions/analytics"

interface FIREData {
    fireTarget: number;
    currentAssets: number;
    monthlySavings: number;
    progress: number;
    yearsRemaining: number;
    monthlyExpenses: number;
}

interface EmergencyData {
    threeMonths: number;
    sixMonths: number;
    currentExpenses: number;
}

export function SavingsCalculators() {
    const [fireData, setFireData] = useState<FIREData | null>(null)
    const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([getFIREData(), getEmergencyFundRecommendation()])
            .then(([fire, emergency]) => {
                setFireData(fire)
                setEmergencyData(emergency)
                setLoading(false)
            })
    }, [])

    if (loading || !fireData || !emergencyData) return (
        <div className="w-full h-[300px] flex items-center justify-center glass rounded-3xl animate-pulse">
            <div className="text-muted-foreground">Kalkulátorok betöltése...</div>
        </div>
    )

    return (
        <Card className="border-none shadow-2xl glass overflow-hidden">
            <CardHeader className="pb-0">
                <Tabs defaultValue="fire" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <CardTitle className="text-2xl font-black">Pénzügyi Eszközök</CardTitle>
                            <CardDescription>Tervezd meg a jövődet okosan</CardDescription>
                        </div>
                        <TabsList className="bg-secondary/50 backdrop-blur-sm">
                            <TabsTrigger value="fire" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                <Flame className="w-4 h-4 mr-2" /> FIRE
                            </TabsTrigger>
                            <TabsTrigger value="emergency" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Vészhelyzet
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="fire" className="mt-0 space-y-6 pb-6 outline-none">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Cél Összeg (FIRE Szám)</span>
                                        <Flame className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="text-3xl font-black">{fireData.fireTarget.toLocaleString()} Ft</div>
                                    <p className="text-xs text-muted-foreground mt-1 italic">A 4%-os szabály alapján ennyi tőkére van szükséged.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold">Haladás az anyagi függetlenség felé</span>
                                        <span className="text-primary font-black">{fireData.progress}%</span>
                                    </div>
                                    <Progress value={fireData.progress} className="h-3 bg-secondary/30" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-muted-foreground uppercase font-bold tracking-wider">Még hátravan</span>
                                        <Calendar className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="text-3xl font-black">
                                        {fireData.yearsRemaining === Infinity ? '∞' : Math.round(fireData.yearsRemaining)} év
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 italic">A jelenlegi megtakarítási rátád ({fireData.monthlySavings.toLocaleString()} Ft/hó) alapján.</p>
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-xl text-xs text-muted-foreground">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span>Növeld a megtakarítási rátádat, hogy korábban érj célt!</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="emergency" className="mt-0 space-y-6 pb-6 outline-none">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest opacity-60">Ajánlott Tartalékok</h4>
                                <div className="grid gap-3">
                                    <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex justify-between items-center group hover:bg-amber-500/10 transition-colors">
                                        <div>
                                            <div className="text-xs font-bold text-amber-500 uppercase">3 Havi Biztonsági</div>
                                            <div className="text-xl font-black">{emergencyData.threeMonths.toLocaleString()} Ft</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                    <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex justify-between items-center group hover:bg-red-500/10 transition-colors">
                                        <div>
                                            <div className="text-xs font-bold text-red-500 uppercase">6 Havi Teljes Biztonság</div>
                                            <div className="text-xl font-black">{emergencyData.sixMonths.toLocaleString()} Ft</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center space-y-4 bg-secondary/20 p-6 rounded-3xl border border-white/5">
                                <div className="p-3 bg-primary/10 rounded-full w-fit">
                                    <PiggyBank className="w-8 h-8 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h5 className="font-bold">Miért fontos a vészhelyzeti tartalék?</h5>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        A havi átlagos kiadásod <span className="text-foreground font-bold">{emergencyData.currentExpenses.toLocaleString()} Ft</span>.
                                        Egy váratlan esemény (pl. munkahely elvesztése) esetén egy tartalék segít megőrizni a nyugalmadat és a pénzügyi stabilitásodat.
                                    </p>
                                </div>
                                <button className="w-full py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                                    Tartalék Cél Létrehozása
                                </button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardHeader>
        </Card>
    )
}
