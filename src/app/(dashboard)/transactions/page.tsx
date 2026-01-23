import { Suspense } from 'react'
import { getTransactions } from "@/actions/transactions"
import { TransactionTable } from "@/components/dashboard/TransactionTable"
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TransactionsPage() {
    const transactions = await getTransactions()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tranzakciók</h2>
                    <p className="text-muted-foreground">Az összes bevételed és kiadásod egy helyen.</p>
                </div>
                <AddTransactionDialog />
            </div>

            <Card className="border-none shadow-sm glass">
                <CardHeader>
                    <CardTitle>Minden tétel</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Betöltés...</div>}>
                        <TransactionTable transactions={transactions} />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}
