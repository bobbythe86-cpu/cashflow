import { getTransactions } from "@/actions/transactions"
import { getModusForecast } from "@/actions/analytics"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { MonthlyComparison } from "@/components/dashboard/MonthlyComparison"
import { ForecastChart } from "@/components/dashboard/ForecastChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, Info } from "lucide-react"

export default async function AnalyticsPage() {
    const [transactions, forecast] = await Promise.all([
        getTransactions(),
        getModusForecast()
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analitika</h2>
                <p className="text-muted-foreground">Mélyebb betekintés a pénzügyi szokásaidba és jövőbeli várakozások.</p>
            </div>

            <Card className="border-none shadow-lg glass bg-primary/5">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                3 Hónapos Cash Flow Előrejelzés
                            </CardTitle>
                            <CardDescription>
                                A rendszeres tranzakcióid és a beállított költségvetésed alapján.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ForecastChart data={forecast} />
                    <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                        <Info className="w-5 h-5 text-blue-500 shrink-0" />
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                            <strong>Hogyan számolunk?</strong> Az előrejelzés figyelembe veszi az aktuális egyenlegedet,
                            a rendszersesen ismétlődő bevételeidet, valamint a kiadásoknál a
                            <strong>magasabb értéket</strong> választja a beállított költségvetésed és a rendszeres kiadásaid közül,
                            hogy a lehető legbiztonságosabb becslést adja.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-sm glass">
                    <CardHeader>
                        <CardTitle>Kiadások megoszlása</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryPieChart transactions={transactions.filter(t => t.type === 'expense')} />
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm glass">
                    <CardHeader>
                        <CardTitle>Bevétel vs Kiadás (Havi)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MonthlyComparison transactions={transactions} />
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm glass">
                <CardHeader>
                    <CardTitle>Pénzügyi összefoglaló</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-sm text-muted-foreground">Legnagyobb kiadásod</p>
                            <p className="text-2xl font-bold text-red-500">
                                {Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0).toLocaleString()} Ft
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-sm text-muted-foreground">Átlagos napi költés</p>
                            <p className="text-2xl font-bold">
                                {Math.round(transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0) / 30).toLocaleString()} Ft
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-sm text-muted-foreground">Tranzakciók száma</p>
                            <p className="text-2xl font-bold">{transactions.length} db</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
