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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createCategory } from '@/actions/categories'

export function AddCategoryDialog() {
    const [open, setOpen] = useState(false)

    async function handleSubmit(formData: FormData) {
        const result = await createCategory(formData)
        if (result.success) {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Új kategória
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Új Kategória</DialogTitle>
                        <DialogDescription>
                            Adj hozzá egy új egyedi kategóriát a pénzügyeidhez.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <RadioGroup defaultValue="expense" name="type" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="expense" id="cat-expense" />
                                <Label htmlFor="cat-expense" className="text-red-500 font-semibold cursor-pointer">Kiadás</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="income" id="cat-income" />
                                <Label htmlFor="cat-income" className="text-green-500 font-semibold cursor-pointer">Bevétel</Label>
                            </div>
                        </RadioGroup>

                        <div className="grid gap-2">
                            <Label htmlFor="name">Kategória neve</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Pl. Sport, Ajándék, Bónusz..."
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Szín választása</Label>
                            <Input
                                id="color"
                                name="color"
                                type="color"
                                defaultValue="#3b82f6"
                                className="h-10 p-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full">Kategória létrehozása</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
