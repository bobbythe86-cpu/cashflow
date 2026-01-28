'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Profile } from '@/types'

export async function getProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // console.log('Fetched profile for:', user.email, 'Role:', data?.role)

    // Vészhelyzeti megoldás: Ha az adatbázis RLS hibát dob, 
    // legalább az Auth adatokból adjunk vissza egy alap profilt
    if (!data) {
        return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Felhasználó',
            role: (user.email === 'bobbythe86@gmail.com' ? 'admin' : 'user'), // Cseréld le a saját email címedre!
            avatar_url: null,
            updated_at: new Date().toISOString()
        } as Profile
    }

    return data as Profile
}

export async function updateProfile(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Bejelentkezés szükséges' }

    const full_name = formData.get('full_name') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) return { error: error.message }

    // Update auth metadata as well
    await supabase.auth.updateUser({
        data: { full_name }
    })

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}

export async function updateLastSeen() {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        await supabase
            .from('profiles')
            .update({
                last_seen_at: new Date().toISOString(),
            })
            .eq('id', user.id)
    } catch (e) {
        // Silent error if column doesn't exist yet
        console.error('Failed to update last seen:', e)
    }
}
