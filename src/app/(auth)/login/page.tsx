'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { login } from '@/actions/auth'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Demo belépés kezelése
        if (email === 'demo@cashflow.hu' && password === 'demo123') {
            document.cookie = "demo-mode=true; path=/; max-age=3600"
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 1000)
            return
        }

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 p-4 relative">
            <Card className="w-full max-w-md border-none shadow-2xl bg-background/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300 relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                        CashFlow
                    </h1>
                    <CardTitle className="text-2xl">Üdvözöljük újra</CardTitle>
                    <CardDescription>
                        Adja meg adatait a belépéshez
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="pelda@email.hu"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Jelszó</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button className="w-full h-11" size="lg" type="submit" disabled={loading}>
                            {loading ? 'Belépés...' : 'Bejelentkezés'}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Vagy folytassa ezzel</span>
                            </div>
                        </div>
                        <Button variant="outline" type="button" className="w-full h-11">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            Google
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        Nincs még fiókja?{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Regisztráció
                        </Link>
                    </div>
                    <Link href="/forgot-password" virtual-link="true" className="text-sm text-primary hover:underline font-medium">
                        Elfelejtett jelszó?
                    </Link>
                </CardFooter>
            </Card>

            <div className="absolute bottom-4 left-4 right-4 sm:fixed sm:bottom-4 sm:right-4 sm:left-auto sm:max-w-xs p-4 bg-primary/10 border border-primary/20 rounded-xl backdrop-blur-md text-xs animate-in slide-in-from-bottom-5 duration-500 z-0">
                <p className="font-bold mb-1">Tesztelési tipp:</p>
                <p>E-mail: <code className="bg-background/50 px-1 rounded">demo@cashflow.hu</code></p>
                <p>Jelszó: <code className="bg-background/50 px-1 rounded">demo123</code></p>
            </div>
        </div>
    )
}
