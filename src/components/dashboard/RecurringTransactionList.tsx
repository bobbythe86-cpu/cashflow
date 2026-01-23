'use client'

import { RecurringTransaction } from "@/types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { Trash2, ArrowUpCircle, ArrowDownCircle, Pause, Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleRecurringStatus, deleteRecurringTransaction } from "@/actions/recurring"
import { cn } from "@/lib/utils"

interface RecurringTransactionListProps {
    transactions: RecurringTransaction[]
}

const frequencyLabels: Record<string, string> = {
    daily: 'Naponta',
    weekly: 'Hetente',
    monthly: 'Havonta',
    yearly: 'Évente'
}

export function RecurringTransactionList({ transactions }: RecurringTransactionListProps) {
    async function handleToggle(id: string, currentStatus: boolean) {
        await toggleRecurringStatus(id, currentStatus)
    }

    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a rendszeres tranzakciót?')) {
            await deleteRecurringTransaction(id)
        }
    }

    if (transactions.length === 0) {
        return (
            <div className="py-20 text-center text-muted-foreground bg-white/5 rounded-xl border border-dashed">
                <Clock className="w-10 h-10 mx-auto mb-4 opacity-20" />
                <p>Még nincsenek beállítva rendszeres tranzakciók.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Leírás</TableHead>
                        <TableHead>Gyakoriság</TableHead>
                        <TableHead>Kategória</TableHead>
                        <TableHead className="text-right">Összeg</TableHead>
                        <TableHead className="text-right">Állapot</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((t) => (
                        <TableRow key={t.id} className={cn("group transition-colors", !t.is_active && "opacity-50")}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    {t.type === 'income' ?
                                        <ArrowUpCircle className="w-5 h-5 text-green-500" /> :
                                        <ArrowDownCircle className="w-5 h-5 text-red-500" />
                                    }
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{t.description}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase">
                                            Kezdés: {format(new Date(t.start_date), 'yyyy. MMM dd.', { locale: hu })}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-medium">
                                    {frequencyLabels[t.frequency]}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs text-muted-foreground">
                                    {t.category?.name || "Nincs kategorizálva"}
                                </span>
                            </TableCell>
                            <TableCell className={cn(
                                "text-right font-bold",
                                t.type === 'income' ? "text-green-500" : "text-red-500"
                            )}>
                                {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} Ft
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                    t.is_active ? "bg-green-500/20 text-green-500" : "bg-zinc-500/20 text-zinc-500"
                                )}>
                                    {t.is_active ? 'Aktív' : 'Szünetel'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleToggle(t.id, t.is_active)}
                                        title={t.is_active ? "Szüneteltetés" : "Aktiválás"}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        {t.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(t.id)}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
