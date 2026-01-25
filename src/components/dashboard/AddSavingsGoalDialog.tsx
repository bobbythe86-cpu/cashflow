'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
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
import { createSavingsGoal } from '@/actions/savings'

export function AddSavingsGoalDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await createSavingsGoal(formData)

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
                <Button className="gap-2 rounded-xl">
                    <Plus className="w-4 h-4" /> Új cél kitűzése
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass border-white/10">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Új megtakarítási cél</DialogTitle>
                        <DialogDescription>
                            Mi a következő nagy álmod? Add meg a részleteket!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Megnevezés</Label>
                            <Input id="name" name="name" placeholder="pl. Lakás önrész, Revolut megtakarítás" required className="rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="target_amount">Célösszeg (Ft)</Label>
                            <Input
                                id="target_amount"
                                name="target_amount"
                                type="number"
                                placeholder="pl. 1000000"
                                required
                                className="rounded-xl"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="current_amount">Jelenlegi megtakarítás (opcionális)</Label>
                            <Input
                                id="current_amount"
                                name="current_amount"
                                type="number"
                                defaultValue="0"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Határidő (opcionális)</Label>
                            <Input
                                id="deadline"
                                name="deadline"
                                type="date"
                                className="rounded-xl"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="color">Kiemelő szín</Label>
                            <input
                                id="color"
                                name="color"
                                type="color"
                                defaultValue="#3b82f6"
                                className="w-full h-10 rounded-xl cursor-pointer bg-transparent"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Borítókép (opcionális)</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                className="rounded-xl cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-lg file:mr-4 file:px-2 file:py-1 file:text-xs file:font-bold"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full rounded-xl">
                            {loading ? 'Létrehozás...' : 'Cél mentése'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
