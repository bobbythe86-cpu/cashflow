import { Suspense } from 'react'
import { getRecurringTransactions } from "@/actions/recurring"
import { RecurringTransactionList } from "@/components/dashboard/RecurringTransactionList"
import { AddRecurringTransactionDialog } from "@/components/dashboard/AddRecurringTransactionDialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Repeat } from 'lucide-react'

export default async function RecurringPage() {
    const transactions = await getRecurringTransactions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Rendszeres tranzakciók</h2>
                    <p className="text-muted-foreground">Ismétlődő bevételek és kiadások kezelése.</p>
                </div>
                <AddRecurringTransactionDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Összes ütemezett</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transactions.length} db</div>
                        <p className="text-xs text-muted-foreground">Aktív és szüneteltetett</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-green-500">Havi rendszeres bevétel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                            +{transactions
                                .filter(t => t.type === 'income' && t.is_active && t.frequency === 'monthly')
                                .reduce((acc, t) => acc + t.amount, 0).toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground">Csak a havi fixek</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm glass">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-red-500">Havi rendszeres kiadás</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">
                            -{transactions
                                .filter(t => t.type === 'expense' && t.is_active && t.frequency === 'monthly')
                                .reduce((acc, t) => acc + t.amount, 0).toLocaleString()} Ft
                        </div>
                        <p className="text-xs text-muted-foreground">Kell a havi fix</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm glass">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Repeat className="w-5 h-5 text-primary" />
                        <div>
                            <CardTitle>Ütemezett tételek</CardTitle>
                            <CardDescription>Itt láthatod az automatikusan ismétlődő tranzakcióidat.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="py-10 text-center">Betöltés...</div>}>
                        <RecurringTransactionList transactions={transactions} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
