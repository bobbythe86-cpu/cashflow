'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCcw, Loader2 } from "lucide-react"
import { resetAccount } from "@/actions/admin"
import { useRouter } from "next/navigation"

export function AdminDangerZone() {
    const [loading, setLoading] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const router = useRouter()

    async function handleReset() {
        if (!confirming) {
            setConfirming(true)
            setTimeout(() => setConfirming(false), 5000) // Reset confirmation after 5 seconds
            return
        }

        setLoading(true)
        const result = await resetAccount()

        if (result.success) {
            alert('A fiók sikeresen alaphelyzetbe állítva!')
            router.refresh()
            setConfirming(false)
        } else {
            alert('Hiba történt: ' + result.error)
        }
        setLoading(false)
    }

    return (
        <Card className="border-2 border-destructive/20 shadow-xl glass overflow-hidden">
            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <CardTitle>Veszélyes Zóna (Saját Adatok)</CardTitle>
                </div>
                <CardDescription>
                    Ez a művelet CSAK A TE ADMIN FIÓKOD adatait törli véglegesen. Más felhasználókat nem érint.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/10">
                    <div className="space-y-1">
                        <h4 className="font-bold text-destructive">Saját adatok teljes törlése</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Minden tranzakciód, megtakarításod, költségvetésed és egyéni kategóriád törlésre kerül.
                            A pénztárcáid egyenlege nullázódik.
                        </p>
                    </div>
                    <Button
                        variant={confirming ? "destructive" : "outline"}
                        className={`min-w-[140px] rounded-xl font-bold transition-all ${confirming ? 'animate-pulse' : ''}`}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : confirming ? (
                            'Biztosan törlöd a SAJÁT adataid?'
                        ) : (
                            <>
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Saját Reset
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
