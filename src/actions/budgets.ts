'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Budget } from '@/types'

export async function getBudgets(month?: number, year?: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const now = new Date()
    const targetMonth = month || now.getMonth() + 1
    const targetYear = year || now.getFullYear()

    const { data, error } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('month', targetMonth)
        .eq('year', targetYear)

    if (error) {
        console.error('Error fetching budgets:', error)
        return []
    }

    return data as Budget[]
}

export async function upsertBudget(categoryId: string, amount: number, month: number, year: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase
        .from('budgets')
        .upsert({
            user_id: user.id,
            category_id: categoryId,
            amount,
            month,
            year
        }, {
            onConflict: 'user_id, category_id, month, year'
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}
