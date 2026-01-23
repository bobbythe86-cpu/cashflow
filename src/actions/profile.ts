'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Profile } from '@/types'

export async function getProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Felhasználó',
            role: 'user' as const,
            avatar_url: null
        }
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
