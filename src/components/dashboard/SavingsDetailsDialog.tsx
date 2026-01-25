'use client'

import { useState, useEffect } from 'react'
import { SavingsGoal, Wallet } from '@/types'
import { getWallets } from '@/actions/wallets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { updateSavingsAmount, deleteSavingsGoal } from '@/actions/savings'
import { Target, Trash2, Plus, Minus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

interface SavingsDetailsDialogProps {
    goal: SavingsGoal
    children: React.ReactNode
}

export function SavingsDetailsDialog({ goal, children }: SavingsDetailsDialogProps) {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [selectedWallet, setSelectedWallet] = useState<string>('')

    useEffect(() => {
        getWallets().then(data => {
            if (data) {
                setWallets(data)
                // Default to first 'bank' or 'cash' wallet
                const defaultWallet = data.find(w => w.type === 'bank') || data[0]
                if (defaultWallet) setSelectedWallet(defaultWallet.id)
            }
        })
    }, [])

    async function handleUpdate(action: 'add' | 'remove') {
        const val = parseInt(amount)
        if (!val || val <= 0) return
        if (!selectedWallet) return alert('Kérlek válassz egy pénztárcát!')

        setLoading(true)
        const next = action === 'add'
            ? goal.current_amount + val
            : Math.max(0, goal.current_amount - val)

        const result = await updateSavingsAmount(goal.id, next, selectedWallet)

        if (result.error) {
            alert(result.error)
        } else {
            setAmount('')
            setOpen(false)
        }
        setLoading(false)
    }

    async function handleDelete() {
        if (confirm('Biztosan törölni szeretnéd ezt a célt?')) {
            setLoading(true)
            await deleteSavingsGoal(goal.id)
            setOpen(false)
        }
    }

    const percent = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-border/50 shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-secondary">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {goal.image_url ? (
                                <img src={goal.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                                <Target className="w-8 h-8 text-primary" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-xl">{goal.name}</DialogTitle>
                            {goal.deadline && (
                                <DialogDescription className="flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {format(new Date(goal.deadline), 'yyyy. MMMM dd.', { locale: hu })}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-6 space-y-6">
                    {/* Status */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Állapot</span>
                            <span className="font-bold">{percent}%</span>
                        </div>
                        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden border border-border">
                            <div
                                className="h-full transition-all duration-500"
                                style={{ width: `${percent}%`, backgroundColor: goal.color }}
                            />
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                            <span>{goal.current_amount.toLocaleString()} Ft</span>
                            <span className="text-muted-foreground">{goal.target_amount.toLocaleString()} Ft</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                        <Label>Egyenleg módosítása</Label>

                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Forrás / Cél Pénztárca</Label>
                            <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Válassz tárcát" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wallets.map(w => (
                                        <SelectItem key={w.id} value={w.id}>
                                            {w.name} ({new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 0 }).format(w.balance)} Ft)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Összeg"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleUpdate('remove')}
                                disabled={loading || !amount || !selectedWallet}
                                className="hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50"
                            >
                                <Minus className="w-4 h-4 mr-2" /> Kivét
                            </Button>
                            <Button
                                onClick={() => handleUpdate('add')}
                                disabled={loading || !amount || !selectedWallet}
                                className="bg-primary hover:bg-primary/90"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Befizet
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between flex-row items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Törlés
                    </Button>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Bezárás
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
