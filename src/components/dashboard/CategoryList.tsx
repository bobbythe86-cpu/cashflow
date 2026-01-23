'use client'

import { Category } from "@/types"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/actions/categories"

interface CategoryListProps {
    categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
            await deleteCategory(id)
        }
    }

    if (categories.length === 0) {
        return <div className="text-center py-4 text-muted-foreground">Nincsenek kategóriák.</div>
    }

    return (
        <div className="space-y-2">
            {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 group">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: c.color || '#ccc' }}
                        />
                        <span className="font-medium">{c.name}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity h-8 w-8"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
        </div>
    )
}
