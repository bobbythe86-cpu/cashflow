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
import { updateSavingsAmount, deleteSavingsGoal, updateRecurringSettings } from '@/actions/savings'
import { Target, Trash2, Plus, Minus, Calendar, Repeat } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

interface SavingsDetailsDialogProps {
    goal: SavingsGoal
    children: React.ReactNode
}

export function SavingsDetailsDialog({ goal, children }: SavingsDetailsDialogProps) {
    const [wallets, setWallets] = useState<Wallet[]>([])
    const [selectedWallet, setSelectedWallet] = useState<string>('')
    const [open, setOpen] = useState(false)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    // Recurring payment state
    const [recurringEnabled, setRecurringEnabled] = useState(goal.recurring_enabled || false)
    const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>(goal.recurring_frequency || 'monthly')
    const [recurringAmount, setRecurringAmount] = useState(goal.recurring_amount?.toString() || '')
    const [recurringWallet, setRecurringWallet] = useState(goal.recurring_wallet_id || '')

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

    async function handleSaveRecurring() {
        if (recurringEnabled && (!recurringAmount || parseFloat(recurringAmount) <= 0)) {
            alert('Kérlek adj meg egy érvényes összeget!')
            return
        }
        if (recurringEnabled && !recurringWallet) {
            alert('Kérlek válassz egy pénztárcát!')
            return
        }

        setLoading(true)
        const result = await updateRecurringSettings(
            goal.id,
            recurringEnabled,
            recurringFrequency,
            recurringEnabled ? parseFloat(recurringAmount) : undefined,
            recurringEnabled ? recurringWallet : undefined
        )

        if (result.error) {
            alert(result.error)
        } else {
            alert('Rendszeres befizetés beállítva!')
        }
        setLoading(false)
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

                    {/* Recurring Payment Settings */}
                    <div className="grid gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Repeat className="w-4 h-4 text-primary" />
                                <Label className="font-semibold">Rendszeres befizetés</Label>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={recurringEnabled}
                                    onChange={(e) => setRecurringEnabled(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {recurringEnabled && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Gyakoriság</Label>
                                    <Select value={recurringFrequency} onValueChange={(v) => setRecurringFrequency(v as 'daily' | 'weekly' | 'monthly')}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Naponta</SelectItem>
                                            <SelectItem value="weekly">Hetente</SelectItem>
                                            <SelectItem value="monthly">Havonta</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Összeg</Label>
                                    <Input
                                        type="number"
                                        placeholder="pl. 10000"
                                        value={recurringAmount}
                                        onChange={(e) => setRecurringAmount(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Forrás pénztárca</Label>
                                    <Select value={recurringWallet} onValueChange={setRecurringWallet}>
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

                                <Button
                                    onClick={handleSaveRecurring}
                                    disabled={loading}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <Repeat className="w-4 h-4 mr-2" />
                                    Beállítások mentése
                                </Button>
                            </div>
                        )}
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
