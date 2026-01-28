'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { signup } from '@/actions/auth'

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const result = await signup(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-md border-none shadow-2xl bg-background/80 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
                <CardHeader className="space-y-1 text-center">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                        Modus
                    </h1>
                    <CardTitle className="text-2xl">Fiók létrehozása</CardTitle>
                    <CardDescription>
                        Kezdje el követni pénzügyeit még ma ingyen
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">Teljes név</Label>
                            <Input id="full_name" name="full_name" placeholder="Minta János" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" name="email" type="email" placeholder="pelda@email.hu" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Jelszó</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button className="w-full h-11" size="lg" disabled={loading}>
                            {loading ? 'Regisztráció...' : 'Regisztráció'}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Vagy regisztráljon ezzel</span>
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
                <CardFooter>
                    <div className="text-sm text-muted-foreground text-center w-full">
                        Már van fiókja?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Bejelentkezés
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
