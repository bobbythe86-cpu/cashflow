'use client'

import { useState, useEffect } from 'react'
import { Repeat } from 'lucide-react'
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
import { createRecurringTransaction } from '@/actions/recurring'
import { getCategories } from '@/actions/categories'
import { Category, RecurringFrequency } from '@/types'

export function AddRecurringTransactionDialog() {
    const [open, setOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [type, setType] = useState<'income' | 'expense'>('expense')
    const [frequency, setFrequency] = useState<RecurringFrequency>('monthly')
    const [categoryId, setCategoryId] = useState<string>('')

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data as Category[])
        }
        fetchCategories()
    }, [])

    async function handleSubmit(formData: FormData) {
        // Ensure manual fields are present (safety fallback for components)
        if (!formData.get('type')) formData.set('type', type)
        if (!formData.get('frequency')) formData.set('frequency', frequency)
        if (!formData.get('category_id')) formData.set('category_id', categoryId)

        const result = await createRecurringTransaction(formData)
        if (result.success) {
            setOpen(false)
            // Reset form defaults
            setType('expense')
            setFrequency('monthly')
            setCategoryId('')
        } else {
            alert(`Hiba történt: ${result.error}`)
        }
    }

    const filteredCategories = categories.filter(c => c.type === type)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20 bg-blue-600 hover:bg-blue-700">
                    <Repeat className="w-4 h-4" />
                    Új rendszeres tétel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border shadow-xl">
                <form action={handleSubmit}>
                    <input type="hidden" name="type" value={type} />
                    <input type="hidden" name="frequency" value={frequency} />
                    <input type="hidden" name="category_id" value={categoryId} />

                    <DialogHeader>
                        <DialogTitle>Új Rendszeres Tranzakció</DialogTitle>
                        <DialogDescription>
                            Állítson be automatikusan ismétlődő bevételeket vagy kiadásokat.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <RadioGroup
                            defaultValue="expense"
                            value={type}
                            onValueChange={(v) => {
                                setType(v as 'income' | 'expense')
                                setCategoryId('') // Reset category when type changes
                            }}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="rec-expense" />
                                <Label htmlFor="rec-expense" className="text-red-500 font-semibold cursor-pointer">Kiadás</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="rec-income" />
                                <Label htmlFor="rec-income" className="text-green-500 font-semibold cursor-pointer">Bevétel</Label>
                            </div>
                        </RadioGroup>

                        <div className="grid gap-2">
                            <Label htmlFor="amount">Összeg (Ft)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                required
                                className="text-lg font-bold"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="frequency">Gyakoriság</Label>
                            <Select
                                value={frequency}
                                onValueChange={(v) => setFrequency(v as RecurringFrequency)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Napi</SelectItem>
                                    <SelectItem value="weekly">Heti</SelectItem>
                                    <SelectItem value="monthly">Havi</SelectItem>
                                    <SelectItem value="yearly">Éves</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Kezdő dátum</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">Végső dátum (Opc.)</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="date"
                                    placeholder="Nem kötelező"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Kategória</Label>
                            <Select
                                value={categoryId}
                                onValueChange={setCategoryId}
                            >
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
                                placeholder="Pl. Lakbér, Előfizetés..."
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Ütemezés mentése</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
