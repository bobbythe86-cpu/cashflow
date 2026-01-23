'use client'

import { useState, useMemo } from "react"
import { Transaction } from "@/types"
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
import { cn } from "@/lib/utils"
import { Trash2, ArrowUpCircle, ArrowDownCircle, Search, FilterX, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { deleteTransaction } from "@/actions/transactions"

interface TransactionTableProps {
    transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const categories = useMemo(() => {
        const uniqueCats = new Set(transactions.map(t => t.category?.name).filter(Boolean))
        return Array.from(uniqueCats)
    }, [transactions])

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = typeFilter === 'all' || t.type === typeFilter
            const matchesCategory = categoryFilter === 'all' || t.category?.name === categoryFilter
            return matchesSearch && matchesType && matchesCategory
        })
    }, [transactions, searchTerm, typeFilter, categoryFilter])

    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a tranzakciót?')) {
            await deleteTransaction(id)
        }
    }

    const resetFilters = () => {
        setSearchTerm('')
        setTypeFilter('all')
        setCategoryFilter('all')
    }

    const exportToCSV = () => {
        const headers = ['Dátum', 'Leírás', 'Kategória', 'Típus', 'Összeg']
        const csvData = filteredTransactions.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.description || '',
            t.category?.name || '',
            t.type === 'income' ? 'Bevétel' : 'Kiadás',
            t.amount
        ])

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n')

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `tranzakciok_${format(new Date(), 'yyyyMMdd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Keresés leírásban vagy kategóriában..."
                        className="pl-9 glass"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={typeFilter} onValueChange={(v: 'all' | 'income' | 'expense') => setTypeFilter(v)}>
                        <SelectTrigger className="w-[130px] glass">
                            <SelectValue placeholder="Típus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Összes</SelectItem>
                            <SelectItem value="income">Bevétel</SelectItem>
                            <SelectItem value="expense">Kiadás</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[150px] glass">
                            <SelectValue placeholder="Kategória" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Összes kategória</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {filteredTransactions.length > 0 && (
                        <Button variant="outline" size="icon" onClick={exportToCSV} title="Exportálás CSV-be" className="glass">
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                    {(searchTerm || typeFilter !== 'all' || categoryFilter !== 'all') && (
                        <Button variant="ghost" size="icon" onClick={resetFilters} title="Szűrők törlése">
                            <FilterX className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>Dátum</TableHead>
                            <TableHead>Leírás</TableHead>
                            <TableHead>Kategória</TableHead>
                            <TableHead className="text-right">Összeg</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((t) => (
                                <TableRow key={t.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        {format(new Date(t.date), 'yyyy. MMM dd.', { locale: hu })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {t.type === 'income' ?
                                                <ArrowUpCircle className="w-4 h-4 text-green-500" /> :
                                                <ArrowDownCircle className="w-4 h-4 text-red-500" />
                                            }
                                            {t.description || "Nincs leírás"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-medium uppercase tracking-wider">
                                            {t.category?.name || "Nincs kategorizálva"}
                                        </span>
                                    </TableCell>
                                    <TableCell className={cn(
                                        "text-right font-semibold",
                                        t.type === 'income' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} Ft
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(t.id)}
                                            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                    Nem található a szűrésnek megfelelő tranzakció.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground px-2">
                Összesen {filteredTransactions.length} tétel találva
            </div>
        </div>
    )
}
