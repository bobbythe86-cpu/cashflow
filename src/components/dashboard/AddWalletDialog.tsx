'use client'

import { useState } from 'react'
import { Plus, Wallet as WalletIcon } from 'lucide-react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { createWallet } from '@/actions/wallets'

const walletTypes = [
    { value: 'bank', label: 'Bankszámla' },
    { value: 'cash', label: 'Készpénz' },
    { value: 'savings', label: 'Megtakarítás' },
    { value: 'credit', label: 'Hitelkártya' },
]

export function AddWalletDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await createWallet(formData)

        if (result.success) {
            setOpen(false)
        } else {
            alert('Hiba történt: ' + result.error)
        }

        setLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Új tárca
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Új pénztárca hozzáadása</DialogTitle>
                        <DialogDescription>
                            Hozz létre egy új tárcát a pénzügyeid elkülönített kezeléséhez.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tárca neve</Label>
                            <Input id="name" name="name" placeholder="pl. OTP Bank, Készpénz" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="type">Típus</Label>
                            <Select name="type" defaultValue="bank">
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz típust" />
                                </SelectTrigger>
                                <SelectContent>
                                    {walletTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="balance">Kezdő egyenleg</Label>
                            <Input
                                id="balance"
                                name="balance"
                                type="number"
                                step="0.01"
                                defaultValue="0"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="currency">Pénznem</Label>
                            <Input id="currency" name="currency" defaultValue="HUF" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Hozzáadás...' : 'Tárca létrehozása'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
