'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { Profile, Suggestion } from '@/types'

async function isAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Kiskapu a biztonság kedvéért
    if (user.email === 'bobbythe86@gmail.com') return true

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

export async function getAdminUsers() {
    if (!(await isAdmin())) return []

    // Az admin klienssel kérjük le, ami átlát az RLS-en
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
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

    const adminSupabase = createAdminClient()

    // Most már mehet az egyszerű join, mert az admin kliens látja
    const { data, error } = await adminSupabase
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

    const adminSupabase = createAdminClient()
    const { error } = await adminSupabase
        .from('suggestions')
        .update({ status })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/admin')
    return { success: true }
}

export async function resetAccount() {
    if (!(await isAdmin())) return { error: 'Nincs jogosultság' }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    // 1. Delete all transactions
    await supabase.from('transactions').delete().eq('user_id', user.id)

    // 2. Delete all savings goals
    await supabase.from('savings_goals').delete().eq('user_id', user.id)

    // 3. Delete all recurring transactions
    await supabase.from('recurring_transactions').delete().eq('user_id', user.id)

    // 4. Reset wallet balances to 0
    await supabase.from('wallets').update({ balance: 0 }).eq('user_id', user.id)

    // 5. Delete milestones / achievements
    await supabase.from('milestones').delete().eq('user_id', user.id)

    // 6. Delete budgets
    await supabase.from('budgets').delete().eq('user_id', user.id)

    // 7. Delete custom categories (NOT the ones where user_id is null)
    await supabase.from('categories').delete().eq('user_id', user.id)

    // 8. Delete suggestions created by this admin
    await supabase.from('suggestions').delete().eq('user_id', user.id)

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/savings')
    revalidatePath('/transactions')
    revalidatePath('/wallets')
    revalidatePath('/admin')
    revalidatePath('/reports')

    return { success: true }
}
