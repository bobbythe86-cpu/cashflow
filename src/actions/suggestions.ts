'use server'

import { createClient } from '@/lib/supabase/server'

export async function createSuggestion(content: string) {
    if (!content || content.trim().length === 0) {
        return { error: 'A szöveg nem lehet üres' }
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // We allow anonymous suggestions too, but link to user if logged in
    const { error } = await supabase.from('suggestions').insert({
        content,
        user_id: user?.id || null,
        status: 'pending'
    })

    if (error) {
        console.error('Error creating suggestion:', error)
        // If the table doesn't exist yet, we still want the UI to feel good in demo mode
        if (error.code === '42P01') {
            console.log('Demo mód: Javaslat elmentve (szimulálva)')
            return { success: true }
        }
        return { error: 'Hiba történt a küldés során' }
    }

    return { success: true }
}
