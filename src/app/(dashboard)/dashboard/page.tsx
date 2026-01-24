import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/actions/transactions"
import { ArrowUpRight, ArrowDownRight, Wallet, History, PiggyBank as PiggyBankIcon, Target } from 'lucide-react'
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { TransactionList } from "@/components/dashboard/TransactionList"
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog"
import { BudgetProgress } from "@/components/dashboard/BudgetProgress"
import { SavingsSummary } from "@/components/dashboard/SavingsSummary"
import { AIInsightCard } from "@/components/dashboard/AIInsightCard"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats) return <div>Betöltés...</div>

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Áttekintés</h2>
                    <p className="text-muted-foreground">Üdvözöljük újra! Így állnak a pénzügyei.</p>
                </div>
                <AddTransactionDialog />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="card-hover border-none shadow-sm glass overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teljes egyenleg</CardTitle>
                        <Wallet className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBalance.toLocaleString()} Ft</div>
                        <div className="mt-4 space-y-2">
                            {stats.wallets.map((wallet) => (
                                <div key={wallet.id} className="flex items-center justify-between text-[11px] border-t border-white/5 pt-2 first:border-0 first:pt-0">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            wallet.type === 'bank' ? "bg-blue-500" :
                                                wallet.type === 'cash' ? "bg-green-500" : "bg-orange-500"
                                        )} />
                                        {wallet.name}
                                    </span>
                                    <span className="font-semibold text-foreground/80">
                                        {new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(wallet.balance)} Ft
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-hover border-none shadow-sm bg-green-500/5 dark:bg-green-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Havi bevétel</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            +{stats.monthlyIncome.toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className={cn(stats.incomeGrowth >= 0 ? "text-green-500" : "text-red-500")}>
                                {stats.incomeGrowth >= 0 ? '+' : ''}{stats.incomeGrowth.toFixed(1)}%
                            </span> az előző hónaphoz képest
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-hover border-none shadow-sm bg-red-500/5 dark:bg-red-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Havi kiadás</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            -{stats.monthlyExpenses.toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <span className={cn(stats.expenseGrowth <= 0 ? "text-green-500" : "text-red-500")}>
                                {stats.expenseGrowth >= 0 ? '+' : ''}{stats.expenseGrowth.toFixed(1)}%
                            </span> az előző hónaphoz képest
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-hover border-none shadow-sm glass">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Havi megtakarítás</CardTitle>
                        <PiggyBankIcon className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground">Ebben a hónapban félretéve</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-none shadow-sm glass">
                    <CardHeader>
                        <CardTitle>Cash Flow Áttekintés</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={stats.chartData} />
                    </CardContent>
                </Card>

                <div className="lg:col-span-3 space-y-4">
                    <AIInsightCard insights={stats.insights} />

                    <Card className="border-none shadow-sm glass">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    Havi Költségvetés
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <BudgetProgress budgets={stats.budgets} monthlyExpensesByCategory={stats.monthlyExpensesByCategory} />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm glass">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <PiggyBankIcon className="w-4 h-4 text-primary" />
                                    Megtakarítási Célok
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <SavingsSummary goals={stats.savingsGoals} />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm glass">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <History className="w-4 h-4 text-primary" />
                                    Legutóbbi tranzakciók
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <TransactionList transactions={stats.recentTransactions} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
