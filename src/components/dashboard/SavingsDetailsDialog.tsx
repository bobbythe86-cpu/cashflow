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
import { updateSavingsAmount, deleteSavingsGoal, updateRecurringSettings, completeSavingsGoal, getSavingsGoals, getGoalProjection } from '@/actions/savings'
import { Target, Trash2, Plus, Minus, Calendar, Repeat, TrendingUp, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'
import { AddSavingsGoalDialog } from './AddSavingsGoalDialog'

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showCompleteOptions, setShowCompleteOptions] = useState(false)
    const [completionAction, setCompletionAction] = useState<'spent' | 'return' | 'transfer'>('spent')
    const [targetId, setTargetId] = useState('')
    const [returnBalance, setReturnBalance] = useState(goal.current_amount > 0)
    const [otherGoals, setOtherGoals] = useState<SavingsGoal[]>([])
    interface GoalProjection {
        daysRemaining: number | null;
        dailyRate?: number;
    }
    const [projection, setProjection] = useState<GoalProjection | null>(null)

    // Recurring payment state
    const [recurringEnabled, setRecurringEnabled] = useState(goal.recurring_enabled || false)
    const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>(goal.recurring_frequency || 'monthly')
    const [recurringAmount, setRecurringAmount] = useState(goal.recurring_amount?.toString() || '')
    const [recurringWallet, setRecurringWallet] = useState(goal.recurring_wallet_id || '')

    useEffect(() => {
        getWallets().then(data => {
            if (data) {
                setWallets(data)
                const defaultWallet = data.find(w => w.type === 'bank') || data[0]
                if (defaultWallet) setSelectedWallet(defaultWallet.id)
            }
        })
        getSavingsGoals().then(data => {
            if (data) {
                setOtherGoals(data.filter(g => g.id !== goal.id && g.status !== 'completed'))
            }
        })
        getGoalProjection(goal.id).then(data => {
            setProjection(data as GoalProjection)
        })
    }, [goal.id])

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
        setLoading(true)
        const result = await deleteSavingsGoal(goal.id, returnBalance ? selectedWallet : undefined)
        if (result.error) {
            alert(result.error)
        } else {
            setOpen(false)
        }
        setLoading(false)
    }

    async function handleComplete() {
        if ((completionAction === 'return' || completionAction === 'transfer') && !targetId) {
            alert('Kérlek válassz egy célhelyet!')
            return
        }

        setLoading(true)
        const result = await completeSavingsGoal(goal.id, completionAction, targetId)
        if (result.error) {
            alert(result.error)
        } else {
            setOpen(false)
        }
        setLoading(false)
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
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl">{goal.name}</DialogTitle>
                                <AddSavingsGoalDialog
                                    initialData={{
                                        id: goal.id,
                                        name: goal.name,
                                        target_amount: goal.target_amount,
                                        current_amount: goal.current_amount,
                                        deadline: goal.deadline || undefined,
                                        color: goal.color || undefined
                                    }}
                                    trigger={
                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-50 hover:opacity-100 transition-opacity">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    }
                                />
                            </div>
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

                        {/* Projection Message */}
                        {projection && projection.daysRemaining !== null && projection.daysRemaining > 0 && (
                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-2 animate-in fade-in duration-700">
                                <TrendingUp className="w-4 h-4 text-primary" />
                                <p className="text-xs text-muted-foreground">
                                    A jelenlegi ütemben várhatóan <span className="text-primary font-bold">{projection.daysRemaining} nap</span> múlva éred el a célodat.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Goal Completion Section */}
                    {goal.current_amount >= goal.target_amount && goal.status !== 'completed' && (
                        <div className="grid gap-4 p-5 bg-green-500/10 rounded-2xl border border-green-500/20 animate-in zoom-in duration-500">
                            <div className="text-center space-y-1">
                                <h4 className="text-lg font-black text-green-500">🎉 Gratulálunk!</h4>
                                <p className="text-xs text-muted-foreground italic">Elérted a megtűzött célodat!</p>
                            </div>

                            {!showCompleteOptions ? (
                                <Button
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                                    onClick={() => setShowCompleteOptions(true)}
                                >
                                    Cél Lezárása
                                </Button>
                            ) : (
                                <div className="space-y-4 pt-2 border-t border-green-500/10">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Mi történjen az összeggel?</Label>
                                        <Select value={completionAction} onValueChange={(v) => {
                                            setCompletionAction(v as 'spent' | 'return' | 'transfer')
                                            setTargetId('')
                                        }}>
                                            <SelectTrigger className="bg-background border-green-500/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="spent">Sikerült elöltenem a célra</SelectItem>
                                                <SelectItem value="return">Pénzt visszateszem tárcába</SelectItem>
                                                <SelectItem value="transfer">Áthelyezem egy másik célba</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {completionAction === 'return' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs text-muted-foreground">Cél Pénztárca</Label>
                                            <Select value={targetId} onValueChange={setTargetId}>
                                                <SelectTrigger className="bg-background border-green-500/20">
                                                    <SelectValue placeholder="Válassz tárcát" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wallets.map(w => (
                                                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {completionAction === 'transfer' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs text-muted-foreground">Másik Megtakarítás</Label>
                                            <Select value={targetId} onValueChange={setTargetId}>
                                                <SelectTrigger className="bg-background border-green-500/20">
                                                    <SelectValue placeholder="Válassz célt" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {otherGoals.map(g => (
                                                        <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                                    ))}
                                                    {otherGoals.length === 0 && (
                                                        <div className="p-2 text-xs text-muted-foreground text-center">Nincs más aktív cél</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShowCompleteOptions(false)}>Mégse</Button>
                                        <Button className="flex-2 bg-green-500 hover:bg-green-600 text-white" disabled={loading} onClick={handleComplete}>
                                            {loading ? 'Folyamatban...' : 'Megerősítés'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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

                <DialogFooter className="sm:justify-between flex-row items-center border-t border-border/50 pt-4">
                    {showDeleteConfirm ? (
                        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20">
                                <p className="text-sm font-medium text-destructive mb-3">Biztosan törölni szeretnéd ezt a célt?</p>

                                {goal.current_amount > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="return-balance"
                                                checked={returnBalance}
                                                onChange={(e) => setReturnBalance(e.target.checked)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <label htmlFor="return-balance" className="text-xs text-muted-foreground cursor-pointer">
                                                A meglévő <span className="font-bold text-foreground">{goal.current_amount.toLocaleString()} Ft</span> visszatöltése a pénztárcába
                                            </label>
                                        </div>

                                        {returnBalance && (
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Cél pénztárca</Label>
                                                <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                                                    <SelectTrigger className="bg-background h-8 text-xs">
                                                        <SelectValue placeholder="Válassz tárcát" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {wallets.map(w => (
                                                            <SelectItem key={w.id} value={w.id}>
                                                                {w.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                                    Mégse
                                </Button>
                                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                                    {loading ? 'Törlés...' : 'Igen, törlöm'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Törlés
                            </Button>
                            <Button variant="secondary" onClick={() => setOpen(false)}>
                                Bezárás
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
