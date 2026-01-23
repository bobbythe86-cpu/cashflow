import { getTransactions } from "@/actions/transactions"
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart"
import { MonthlyComparison } from "@/components/dashboard/MonthlyComparison"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalyticsPage() {
    const transactions = await getTransactions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Analitika</h2>
                <p className="text-muted-foreground">Mélyebb betekintés a pénzügyi szokásaidba.</p>
            </div>

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
