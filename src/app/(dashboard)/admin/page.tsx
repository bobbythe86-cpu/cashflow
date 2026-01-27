import { getAdminUsers, getAdminSuggestions } from "@/actions/admin"
import { getProfile } from "@/actions/profile"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { hu } from "date-fns/locale"
import { Users, MessageSquare, ShieldCheck, Mail, Clock, ShieldAlert } from "lucide-react"
import { AdminDangerZone } from "@/components/admin/AdminDangerZone"

// Simple Badge component mapping
function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        pending: "outline",
        reviewed: "secondary",
        implemented: "default",
    }
    const labels = {
        pending: "Függőben",
        reviewed: "Áttekintve",
        implemented: "Kész",
    }
    return (
        <Badge variant={variants[status] || "default"}>
            {labels[status as keyof typeof labels]}
        </Badge>
    )
}

export default async function AdminPage() {
    const profile = await getProfile()

    // Safety check - only admin
    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard')
    }

    const [users, suggestions] = await Promise.all([
        getAdminUsers(),
        getAdminSuggestions()
    ])

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight">Adminisztrációs Felület</h2>
                </div>
                <p className="text-muted-foreground mt-1">Rendszerszintű áttekintés és javaslatok kezelése.</p>
            </div>

            <Tabs defaultValue="suggestions" className="space-y-6">
                <TabsList className="glass p-1">
                    <TabsTrigger value="suggestions" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Javaslatok ({suggestions.length})
                    </TabsTrigger>
                    <TabsTrigger value="users" className="gap-2">
                        <Users className="w-4 h-4" />
                        Felhasználók ({users.length})
                    </TabsTrigger>
                    <TabsTrigger value="system" className="gap-2 text-destructive data-[state=active]:bg-destructive data-[state=active]:text-white">
                        <ShieldAlert className="w-4 h-4" />
                        Rendszer
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="suggestions">
                    <Card className="border-none shadow-xl glass overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle>Beérkezett javaslatok</CardTitle>
                            <CardDescription>A felhasználók által a FeedbackWidget-en keresztül küldött üzenetek.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Felhasználó</TableHead>
                                        <TableHead>Üzenet</TableHead>
                                        <TableHead>Dátum</TableHead>
                                        <TableHead>Állapot</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suggestions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                                                Még nem érkezett javaslat.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        suggestions.map((s) => (
                                            <TableRow key={s.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{s.profile?.full_name || 'Anonim'}</span>
                                                        <span className="text-xs text-muted-foreground">{s.profile?.email || 'Nincs email'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    <p className="text-sm leading-relaxed">{s.content}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(s.created_at), 'yyyy. MMM dd. HH:mm', { locale: hu })}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={s.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users">
                    <Card className="border-none shadow-xl glass overflow-hidden">
                        <CardHeader className="border-b bg-muted/30">
                            <CardTitle>Regisztrált Felhasználók</CardTitle>
                            <CardDescription>Az alkalmazásba eddig beregisztrált személyek listája.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Név</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Szerepkör</TableHead>
                                        <TableHead>Utolsó aktivitás</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((u) => (
                                        <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-semibold">{u.full_name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                                    {u.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                                    {u.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {format(new Date(u.updated_at), 'yyyy. MMM dd.', { locale: hu })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system">
                    <AdminDangerZone />
                </TabsContent>
            </Tabs>
        </div>
    )
}

