'use client'

import { useState, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateTransaction, deleteTransaction } from '@/actions/transactions'
import { getCategories } from '@/actions/categories'
import { getWallets } from '@/actions/wallets'
import { Category, Wallet, Transaction } from '@/types'

interface EditTransactionDialogProps {
    transaction: Transaction
    trigger?: React.ReactNode
}

export function EditTransactionDialog({ transaction, trigger }: EditTransactionDialogProps) {
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [type, setType] = useState<'income' | 'expense'>(transaction.type)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        async function fetchData() {
            const [cats, walls] = await Promise.all([
                getCategories(),
                getWallets()
            ])
            setCategories(cats as Category[])
            setWallets(walls as Wallet[])
        }
        fetchData()
    }, [open])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const result = await updateTransaction(transaction.id, formData)

        if (result.success) {
            setOpen(false)
        } else {
            alert(result.error)
        }
        setLoading(false)
    }

    async function handleDelete() {
        if (confirm('Biztosan törölni szeretnéd ezt a tranzakciót?')) {
            setLoading(true)
            const result = await deleteTransaction(transaction.id)
            if (result.success) {
                setOpen(false)
            } else {
                alert(result.error)
            }
            setLoading(false)
        }
    }

    const filteredCategories = categories.filter(c => c.type === type)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border/50 shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tranzakció Módosítása</DialogTitle>
                        <DialogDescription>
                            Frissítse a tranzakció adatait.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <RadioGroup
                            defaultValue={transaction.type}
                            name="type"
                            className="flex gap-4"
                            onValueChange={(v: "income" | "expense") => setType(v)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="edit-expense" />
                                <Label htmlFor="edit-expense" className="text-red-500 font-semibold cursor-pointer">Kiadás</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="edit-income" />
                                <Label htmlFor="edit-income" className="text-green-500 font-semibold cursor-pointer">Bevétel</Label>
                            </div>
                        </RadioGroup>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Összeg (Ft)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="1"
                                defaultValue={transaction.amount}
                                required
                                className="text-lg font-bold"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Kategória</Label>
                            <Select name="category_id" defaultValue={transaction.category_id || undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz kategóriát" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="wallet_id">Pénztárca</Label>
                            <Select name="wallet_id" defaultValue={transaction.wallet_id || undefined}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz pénztárcát" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map((wallet) => (
                                        <SelectItem key={wallet.id} value={wallet.id}>
                                            {wallet.name} ({wallet.balance.toLocaleString()} Ft)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Leírás</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue={transaction.description || ''}
                                placeholder="Részletek..."
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Dátum</Label>
                            <Input
                                id="date"
                                name="date"
                                type="date"
                                defaultValue={transaction.date.split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={loading}
                            className="sm:mr-auto"
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Törlés
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Mentés...' : 'Változtatások mentése'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
