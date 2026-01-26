import { getBudgets } from "@/actions/budgets"
import { getCategories } from "@/actions/categories"
import { getDashboardStats } from "@/actions/transactions"
import { BudgetList } from "@/components/dashboard/BudgetList"
import { BudgetProgress } from "@/components/dashboard/BudgetProgress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PiggyBank, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react"

export const metadata = {
    title: 'Költségvetés | CashFlow',
    description: 'Kezeld a havi költségvetésedet és kövesd nyomon a kiadásaidat.',
}

export default async function BudgetsPage() {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const [categories, budgets, stats] = await Promise.all([
        getCategories(),
        getBudgets(currentMonth, currentYear),
        getDashboardStats()
    ])

    const expenseCategories = categories.filter(c => c.type === 'expense')
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
    const totalSpent = Object.values(stats.monthlyExpensesByCategory).reduce((sum, val) => sum + val, 0)
    const remaining = totalBudget - totalSpent
    const percentUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

    const monthNames = [
        'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
        'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ]

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <PiggyBank className="w-8 h-8 text-primary" />
                        Költségvetés
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {monthNames[currentMonth - 1]} {currentYear} - Havi keretek kezelése
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Teljes keret</CardTitle>
                        <PiggyBank className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalBudget.toLocaleString()} Ft</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {budgets.length} kategória
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Elköltve</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSpent.toLocaleString()} Ft</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {percentUsed}% felhasználva
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maradvány</CardTitle>
                        {remaining >= 0 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {remaining.toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {remaining >= 0 ? 'Keretben vagy' : 'Túllépted a keretet'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="manage" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="manage">Keretek beállítása</TabsTrigger>
                    <TabsTrigger value="progress">Haladás</TabsTrigger>
                </TabsList>

                <TabsContent value="manage" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Havi keretek</CardTitle>
                            <CardDescription>
                                Állítsd be, mennyit szeretnél költeni kategóriánként ebben a hónapban.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BudgetList
                                categories={expenseCategories}
                                budgets={budgets}
                                month={currentMonth}
                                year={currentYear}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Költési haladás</CardTitle>
                            <CardDescription>
                                Kövesd nyomon, mennyit költöttél az egyes kategóriákban.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BudgetProgress
                                budgets={budgets}
                                monthlyExpensesByCategory={stats.monthlyExpensesByCategory}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
