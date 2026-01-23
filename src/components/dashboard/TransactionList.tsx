import { Transaction } from "@/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

interface TransactionListProps {
    transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <p>Nincsenek tranzakciók.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-full",
                            t.type === 'income' ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-red-100 text-red-600 dark:bg-red-900/30"
                        )}>
                            {t.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="font-medium">{t.description || t.category?.name || 'Nincs kategorizálva'}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(t.date), 'yyyy. MMM dd.', { locale: hu })}</p>
                        </div>
                    </div>
                    <div className={cn(
                        "font-semibold",
                        t.type === 'income' ? "text-green-600" : "text-red-600"
                    )}>
                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} Ft
                    </div>
                </div>
            ))}
        </div>
    )
}
