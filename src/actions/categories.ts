'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType } from '@/types'
import { updateMilestoneProgress } from './milestones'

const isConfigured = () =>
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

const MOCK_CATEGORIES = [
    { id: '1', name: 'Étel', type: 'expense', color: '#ef4444', icon: 'UtensilsCrossed' },
    { id: '2', name: 'Fizetés', type: 'income', color: '#10b981', icon: 'Wallet' },
    { id: '3', name: 'Lakhatás', type: 'expense', color: '#3b82f6', icon: 'Home' },
    { id: '4', name: 'Szórakozás', type: 'expense', color: '#8b5cf6', icon: 'Gamepad2' },
    { id: '5', name: 'Közlekedés', type: 'expense', color: '#f59e0b', icon: 'Car' },
]

export async function getCategories() {
    if (!isConfigured()) return MOCK_CATEGORIES

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return MOCK_CATEGORIES

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error || !categories || categories.length === 0) {
        return MOCK_CATEGORIES
    }

    // Fetch stats for each category
    const { data: transactions } = await supabase
        .from('transactions')
        .select('amount, category_id, date')
        .eq('user_id', user.id)

    const categoriesWithStats = categories.map(cat => {
        const catTrans = transactions?.filter(t => t.category_id === cat.id) || []
        const count = catTrans.length
        const total = catTrans.reduce((sum, t) => sum + t.amount, 0)

        // Find last used date
        let lastUsed = null
        if (count > 0) {
            const sortedDates = catTrans
                .map(t => new Date(t.date).getTime())
                .sort((a, b) => b - a)
            lastUsed = new Date(sortedDates[0]).toISOString()
        }

        return {
            ...cat,
            transactionCount: count,
            totalAmount: total,
            lastUsed: lastUsed
        }
    })

    return categoriesWithStats
}

export async function createCategory(formData: FormData) {
    if (!isConfigured()) {
        revalidatePath('/dashboard')
        return { success: true }
    }

    const supabase = createClient()
    const name = formData.get('name') as string
    const type = formData.get('type') as TransactionType
    const color = formData.get('color') as string
    const icon = formData.get('icon') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase.from('categories').insert({
        user_id: user.id,
        name,
        type,
        color,
        icon: icon || 'Tag'
    })

    if (error) return { error: error.message }

    await updateMilestoneProgress(user.id, 'budget_master')

    revalidatePath('/dashboard')
    revalidatePath('/categories')
    return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
    if (!isConfigured()) {
        revalidatePath('/dashboard')
        return { success: true }
    }

    const supabase = createClient()
    const name = formData.get('name') as string
    const color = formData.get('color') as string
    const icon = formData.get('icon') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase
        .from('categories')
        .update({
            name,
            color,
            icon: icon || 'Tag'
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/categories')
    return { success: true }
}

export async function deleteCategory(id: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/categories')
    return { success: true }
}
