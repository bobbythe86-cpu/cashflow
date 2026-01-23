import { getCategories } from "@/actions/categories"
import { getProfile } from "@/actions/profile"
import { CategoryList } from "@/components/dashboard/CategoryList"
import { AddCategoryDialog } from "@/components/dashboard/AddCategoryDialog"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function SettingsPage() {
    const [categories, profile] = await Promise.all([
        getCategories(),
        getProfile()
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Beállítások</h2>
                <p className="text-muted-foreground">Személyre szabhatod a kategóriákat és a profilodat.</p>
            </div>

            <Tabs defaultValue="categories" className="space-y-4">
                <TabsList className="glass">
                    <TabsTrigger value="categories">Kategóriák</TabsTrigger>
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
