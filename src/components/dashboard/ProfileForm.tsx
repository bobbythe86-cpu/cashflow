'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/actions/profile'
import { Profile } from '@/types'
import { toast } from 'sonner' // Assuming the user might want toast later, for now alert or simple state

interface ProfileFormProps {
    profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [fullName, setFullName] = useState(profile.full_name || '')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const result = await updateProfile(formData)

        if (result.success) {
            alert('Profil sikeresen frissítve!')
        } else {
            alert('Hiba történt: ' + result.error)
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">E-mail cím</Label>
                    <Input
                        id="email"
                        value={profile.email || ''}
                        disabled
                        className="bg-secondary/50 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Az e-mail cím nem módosítható.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="full_name">Teljes név</Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Minta János"
                        required
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? 'Mentés...' : 'Profil mentése'}
            </Button>
        </form>
    )
}
