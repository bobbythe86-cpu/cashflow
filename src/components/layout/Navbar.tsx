'use client'

import { useEffect, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getProfile } from '@/actions/profile'
import { Profile } from '@/types'

export function Navbar() {
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        async function fetchProfile() {
            const data = await getProfile()
            if (data && !('error' in data)) {
                setProfile(data as Profile)
            }
        }
        fetchProfile()
    }, [])

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : '??'

    return (
        <header className="h-16 border-b bg-background/60 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
            {/* Mobile Logo */}
            <div className="lg:hidden">
                <h1 className="text-xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    CF
                </h1>
            </div>

            <div className="hidden sm:flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Keresés..."
                        className="pl-10 h-9 bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </Button>
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">{profile?.full_name || 'Betöltés...'}</p>
                        <p className="text-xs text-muted-foreground">
                            {profile?.email ? 'Prémium fiók' : 'Vendég'}
                        </p>
                    </div>
                    <Avatar className="w-9 h-9 border-2 border-primary/20">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    )
}
