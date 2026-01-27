'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
import { updateCategory } from '@/actions/categories'
import { IconPicker } from './IconPicker'
import { Category } from '@/types'

interface EditCategoryDialogProps {
    category: Category
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedIcon, setSelectedIcon] = useState(category.icon || 'Tag')

    async function handleSubmit(formData: FormData) {
        formData.append('icon', selectedIcon)
        const result = await updateCategory(category.id, formData)
        if (result.success) {
            setOpen(false)
        } else if (result.error) {
            alert('Hiba: ' + result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Kategória szerkesztése</DialogTitle>
                        <DialogDescription>
                            Módosítsd a kategória nevét, ikonját és színét.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Kategória neve</Label>
                            <Input
                                id="edit-name"
                                name="name"
                                defaultValue={category.name}
                                placeholder="Pl. Sport, Ajándék, Bónusz..."
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Ikon választása</Label>
                            <IconPicker selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-color">Szín választása</Label>
                            <Input
                                id="edit-color"
                                name="color"
                                type="color"
                                defaultValue={category.color || '#3b82f6'}
                                className="h-10 p-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full">Mentés</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
