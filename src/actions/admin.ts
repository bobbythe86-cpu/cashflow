'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Profile, Suggestion } from '@/types'

async function isAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

export async function getAdminUsers() {
    if (!(await isAdmin())) return []

    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin users:', error)
        return []
    }

    return data as Profile[]
}

export async function getAdminSuggestions() {
    if (!(await isAdmin())) return []

    const supabase = createClient()
    const { data, error } = await supabase
        .from('suggestions')
        .select('*, profile:profiles(full_name, email)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin suggestions:', error)
        return []
    }

    return data as (Suggestion & { profile: { full_name: string, email: string } | null })[]
}

export async function updateSuggestionStatus(id: string, status: Suggestion['status']) {
    if (!(await isAdmin())) return { error: 'Nincs jogosultság' }

    const supabase = createClient()
    const { error } = await supabase
        .from('suggestions')
        .update({ status })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}
