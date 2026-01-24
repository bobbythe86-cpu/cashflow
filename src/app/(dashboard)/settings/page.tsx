import { getCategories } from "@/actions/categories"
import { getProfile } from "@/actions/profile"
import { getWallets } from "@/actions/wallets"
import { getBudgets } from "@/actions/budgets"
import { CategoryList } from "@/components/dashboard/CategoryList"
import { AddCategoryDialog } from "@/components/dashboard/AddCategoryDialog"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { WalletList } from "@/components/dashboard/WalletList"
import { AddWalletDialog } from "@/components/dashboard/AddWalletDialog"
import { BudgetList } from "@/components/dashboard/BudgetList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsPage() {
    const [categories, profile, wallets, budgets] = await Promise.all([
        getCategories(),
        getProfile(),
        getWallets(),
        getBudgets()
    ])

    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Beállítások</h2>
                <p className="text-muted-foreground">Személyre szabhatod a kategóriákat és a profilodat.</p>
            </div>

            <Tabs defaultValue="categories" className="space-y-4">
                <TabsList className="glass">
                    <TabsTrigger value="categories">Kategóriák</TabsTrigger>
                    <TabsTrigger value="wallets">Pénztárcák</TabsTrigger>
                    <TabsTrigger value="budgets">Költségvetés</TabsTrigger>
                    <TabsTrigger value="profile">Profil</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Kezeld a kategóriáidat</h3>
                            <p className="text-sm text-muted-foreground">Itt adhatsz hozzá új kategóriákat vagy törölheted a meglévőket.</p>
                        </div>
                        <AddCategoryDialog />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="border-none shadow-sm glass">
                            <CardHeader>
                                <CardTitle className="text-red-500">Kiadás kategóriák</CardTitle>
                                <CardDescription>Mire költöd a pénzed?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CategoryList categories={categories.filter(c => c.type === 'expense')} />
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm glass">
                            <CardHeader>
                                <CardTitle className="text-green-500">Bevétel kategóriák</CardTitle>
                                <CardDescription>Honnan érkezik a pénz?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CategoryList categories={categories.filter(c => c.type === 'income')} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="wallets" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium">Kezeld a pénztárcáidat</h3>
                            <p className="text-sm text-muted-foreground">Adhatsz hozzá bankszámlákat, hitelkártyákat vagy készpénzt.</p>
                        </div>
                        <AddWalletDialog />
                    </div>

                    <WalletList wallets={wallets} />
                </TabsContent>

                <TabsContent value="budgets" className="space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Havi keretek beállítása</h3>
                        <p className="text-sm text-muted-foreground">Állítsd be, mennyit tervezel költeni az egyes kategóriákban ebben a hónapban.</p>
                    </div>

                    <BudgetList
                        categories={categories.filter(c => c.type === 'expense')}
                        budgets={budgets}
                        month={month}
                        year={year}
                    />
                </TabsContent>

                <TabsContent value="profile">
                    <Card className="border-none shadow-sm glass">
                        <CardHeader>
                            <CardTitle>Profil beállítások</CardTitle>
                            <CardDescription>Személyes adataid kezelése.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {profile ? (
                                <ProfileForm profile={profile} />
                            ) : (
                                <p className="text-muted-foreground italic">Nincs elérhető profil adat.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
