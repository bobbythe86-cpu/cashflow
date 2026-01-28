import { getCategories } from "@/actions/categories"
import { CategoryList } from "@/components/dashboard/CategoryList"
import { AddCategoryDialog } from "@/components/dashboard/AddCategoryDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers } from "lucide-react"

export const metadata = {
    title: 'Kategóriák | Modus',
    description: 'Kezeld a bevételi és kiadási kategóriáidat.',
}

export default async function CategoriesPage() {
    const categories = await getCategories()

    const incomeCategories = categories.filter(c => c.type === 'income')
    const expenseCategories = categories.filter(c => c.type === 'expense')

    return (
        <div className="space-y-8 p-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent inline-flex items-center gap-2">
                        <Layers className="w-8 h-8 text-primary" />
                        Kategóriák
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Kezeld a bevételi és kiadási kategóriáidat
                    </p>
                </div>
                <AddCategoryDialog />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bevételi kategóriák</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{incomeCategories.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Aktív kategória
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Kiadási kategóriák</CardTitle>
                        <div className="h-4 w-4 rounded-full bg-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenseCategories.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Aktív kategória
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="expense" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="expense">Kiadások</TabsTrigger>
                    <TabsTrigger value="income">Bevételek</TabsTrigger>
                </TabsList>

                <TabsContent value="expense" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kiadási kategóriák</CardTitle>
                            <CardDescription>
                                Szerkeszd vagy törölj kiadási kategóriákat. Kattints a ceruza ikonra a szerkesztéshez.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategoryList categories={expenseCategories} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="income" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bevételi kategóriák</CardTitle>
                            <CardDescription>
                                Szerkeszd vagy törölj bevételi kategóriákat. Kattints a ceruza ikonra a szerkesztéshez.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategoryList categories={incomeCategories} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
