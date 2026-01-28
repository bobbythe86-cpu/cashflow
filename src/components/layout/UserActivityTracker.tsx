'use client'

import { useEffect } from 'react'
import { updateLastSeen } from '@/actions/profile'
import { usePathname } from 'next/navigation'

export function UserActivityTracker() {
    const pathname = usePathname()

    useEffect(() => {
        // Frissítjük az utolsó aktivitást minden oldalváltáskor
        updateLastSeen()
    }, [pathname])

    return null
}
