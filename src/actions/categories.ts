'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType } from '@/types'

const isConfigured = () =>
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

const MOCK_CATEGORIES = [
    { id: '1', name: 'Étel', type: 'expense', color: '#ef4444' },
    { id: '2', name: 'Fizetés', type: 'income', color: '#10b981' },
    { id: '3', name: 'Lakhatás', type: 'expense', color: '#3b82f6' },
    { id: '4', name: 'Szórakozás', type: 'expense', color: '#8b5cf6' },
    { id: '5', name: 'Közlekedés', type: 'expense', color: '#f59e0b' },
]

export async function getCategories() {
    if (!isConfigured()) return MOCK_CATEGORIES

    const supabase = createClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
        return MOCK_CATEGORIES
    }

    return data
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase.from('categories').insert({
        user_id: user.id,
        name,
        type,
        color,
    })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function deleteCategory(id: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}
