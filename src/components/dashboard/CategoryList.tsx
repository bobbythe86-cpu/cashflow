'use client'

import { Category } from "@/types"
import { Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/actions/categories"
import { EditCategoryDialog } from "./EditCategoryDialog"
import * as Icons from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

interface CategoryListProps {
    categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
    async function handleDelete(id: string) {
        if (confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
            await deleteCategory(id)
        }
    }

    function getIcon(iconName: string | null | undefined) {
        if (!iconName) return Tag
        const Icon = (Icons as unknown as Record<string, React.ElementType>)[iconName]
        return Icon || Tag
    }

    if (categories.length === 0) {
        return <div className="text-center py-4 text-muted-foreground">Nincsenek kategóriák.</div>
    }

    return (
        <TooltipProvider>
            <div className="space-y-2">
                {categories.map((c) => {
                    const IconComponent = getIcon(c.icon)
                    return (
                        <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 group hover:bg-secondary/50 transition-colors">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-3 cursor-help">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: c.color || '#ccc' }}
                                        >
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="font-medium">{c.name}</span>
                                            <p className="text-xs text-muted-foreground">
                                                {c.type === 'income' ? 'Bevétel' : 'Kiadás'}
                                            </p>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-xs space-y-1">
                                        <p><strong>Tranzakciók:</strong> {c.transactionCount || 0} db</p>
                                        <p><strong>Összeg:</strong> {(c.totalAmount || 0).toLocaleString()} Ft</p>
                                        <p><strong>Utoljára használva:</strong> {
                                            c.lastUsed
                                                ? format(new Date(c.lastUsed), 'yyyy. MMM dd.', { locale: hu })
                                                : 'Még soha'
                                        }</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>

                            <div className="flex items-center gap-1">
                                <EditCategoryDialog category={c} />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(c.id)}
                                    className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity h-8 w-8"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}
