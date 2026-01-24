'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SavingsGoal } from '@/types'

const isConfigured = () =>
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

export async function getSavingsGoals() {
    if (!isConfigured()) return []

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching savings goals:', error)
        return []
    }

    return data as SavingsGoal[]
}

export async function createSavingsGoal(formData: FormData) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const name = formData.get('name') as string
    const target_amount = parseFloat(formData.get('target_amount') as string)
    const current_amount = parseFloat(formData.get('current_amount') as string) || 0
    const deadline = formData.get('deadline') as string
    const color = formData.get('color') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase.from('savings_goals').insert({
        user_id: user.id,
        name,
        target_amount,
        current_amount,
        deadline: deadline || null,
        color: color || 'hsl(var(--primary))'
    })

    if (error) return { error: error.message }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateSavingsAmount(id: string, newAmount: number) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase
        .from('savings_goals')
        .update({ current_amount: newAmount })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteSavingsGoal(id: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase.from('savings_goals').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    return { success: true }
}
