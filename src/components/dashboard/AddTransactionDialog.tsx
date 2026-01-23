'use client'

import { useState, useEffect } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createTransaction } from '@/actions/transactions'
import { getCategories } from '@/actions/categories'
import { Category } from '@/types'

export function AddTransactionDialog() {
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [type, setType] = useState<'income' | 'expense'>('expense')

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data as Category[])
        }
        fetchCategories()
    }, [])

    async function handleSubmit(formData: FormData) {
        const result = await createTransaction(formData)
        if (result.success) {
            setOpen(false)
        }
    }

    const filteredCategories = categories.filter(c => c.type === type)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Új tranzakció
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Új Tranzakció</DialogTitle>
                        <DialogDescription>
                            Rögzítsen egy új bevételt vagy kiadást. Kattintson a mentésre ha végzett.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <RadioGroup
                            defaultValue="expense"
                            name="type"
                            className="flex gap-4"
                            onValueChange={(v) => setType(v as 'income' | 'expense')}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="expense" />
                                <Label htmlFor="expense" className="text-red-500 font-semibold cursor-pointer">Kiadás</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="income" />
                                <Label htmlFor="income" className="text-green-500 font-semibold cursor-pointer">Bevétel</Label>
                            </div>
                        </RadioGroup>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Összeg (Ft)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                step="1"
                                placeholder="0"
                                required
                                className="text-lg font-bold"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Kategória</Label>
                            <Select name="category_id">
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
                            <Label htmlFor="description">Leírás</Label>
                            <Input
                                id="description"
                                name="description"
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
                                defaultValue={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full">Tranzakció mentése</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
