'use client'

import { useState, useEffect } from "react"
import { getTransactions, getDashboardStats } from "@/actions/transactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Printer, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Transaction, DashboardStats } from "@/types"

export default function ReportsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const [trans, s] = await Promise.all([
                getTransactions(),
                getDashboardStats()
            ])
            setTransactions(trans)
            setStats(s)
            setLoading(false)
        }
        fetchData()
    }, [])

    if (loading || !stats) return <div className="p-8 text-center">Betöltés...</div>

    const now = new Date()
    const currentMonthName = format(now, 'MMMM', { locale: hu })
    const currentYear = now.getFullYear()

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyTrans = transactions.filter(t => new Date(t.date) >= monthStart)
    const monthlyIncome = monthlyTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
    const monthlyExpenses = monthlyTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)

    const handlePrint = () => {
        window.print()
    }

    const exportToCSV = () => {
        const headers = ['Dátum', 'Leírás', 'Pénztárca', 'Kategória', 'Típus', 'Összeg']
        const csvData = transactions.map(t => [
            format(new Date(t.date), 'yyyy-MM-dd'),
            t.description || '',
            t.wallet?.name || '',
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
        link.setAttribute('download', `cashflow_teljes_riport_${format(new Date(), 'yyyyMMdd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12 print:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Jelentések</h2>
                    <p className="text-muted-foreground">Havi zárások, statisztikák és exportálható riportok.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" /> Nyomtatás / PDF
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-xl glass overflow-hidden border-l-4 border-primary">
                <CardHeader className="bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">{currentYear}. {currentMonthName}</CardTitle>
                            <CardDescription>Aktuális havi pénzügyi mérleg</CardDescription>
                        </div>
                        <Calendar className="w-8 h-8 text-primary/20" />
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" /> Összes bevétel
                            </p>
                            <p className="text-3xl font-black text-green-600 dark:text-green-400">
                                {monthlyIncome.toLocaleString()} Ft
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <TrendingDown className="w-4 h-4 text-red-500" /> Összes kiadás
                            </p>
                            <p className="text-3xl font-black text-red-600 dark:text-red-400">
                                {monthlyExpenses.toLocaleString()} Ft
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-blue-500" /> Havi egyenleg
                            </p>
                            <p className={cn(
                                "text-3xl font-black",
                                (monthlyIncome - monthlyExpenses) >= 0 ? "text-primary text-blue-600" : "text-red-500"
                            )}>
                                {(monthlyIncome - monthlyExpenses).toLocaleString()} Ft
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1">
                <Card className="border-none shadow-md glass">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" /> Riportok generálása
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            onClick={exportToCSV}
                            className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group print:hidden"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold">Tranzakciós napló (CSV)</h4>
                                    <p className="text-xs text-muted-foreground">Az összes tranzakció részletes listája Excel formátumban.</p>
                                </div>
                                <Download className="w-5 h-5 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group print:hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold">Havi költségvetési jelentés (PDF)</h4>
                                    <p className="text-xs text-muted-foreground">Kategóriánkénti bontás és keret-teljesülés elemzés.</p>
                                </div>
                                <Printer className="w-5 h-5 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md glass border-t-4 border-yellow-500/50 print:hidden">
                    <CardHeader>
                        <CardTitle>Havi Zárás</CardTitle>
                        <CardDescription>Véglegesítsd a hónapot és rögzítsd a megtakarításaidat.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            A havi zárás segít nyomon követni a hosszú távú céljaidat (pl. éves megtakarítási tervek).
                        </p>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold h-12 rounded-xl">
                            {currentMonthName} lezárása
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Print only section */}
            <div className="hidden print:block space-y-8">
                <h3 className="text-xl font-bold border-b pb-2">Részletes tranzakciók - {currentMonthName}</h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="py-2">Dátum</th>
                            <th>Leírás</th>
                            <th>Kategória</th>
                            <th className="text-right">Összeg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyTrans.map(t => (
                            <tr key={t.id} className="border-b">
                                <td className="py-2">{format(new Date(t.date), 'yyyy.MM.dd')}</td>
                                <td>{t.description}</td>
                                <td>{t.category?.name}</td>
                                <td className={cn("text-right font-bold", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} Ft
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
