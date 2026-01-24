'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Wallet } from '@/types'

export async function getWallets() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching wallets:', error)
        return []
    }

    return data as Wallet[]
}

export async function createWallet(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Bejelentkezés szükséges' }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const balance = parseFloat(formData.get('balance') as string) || 0
    const currency = formData.get('currency') as string || 'HUF'
    const color = formData.get('color') as string

    const { error } = await supabase
        .from('wallets')
        .insert({
            user_id: user.id,
            name,
            type,
            balance,
            currency,
            color
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}

export async function updateWallet(id: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Bejelentkezés szükséges' }

    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const balance = parseFloat(formData.get('balance') as string)
    const currency = formData.get('currency') as string
    const color = formData.get('color') as string

    const { error } = await supabase
        .from('wallets')
        .update({
            name,
            type,
            balance,
            currency,
            color
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}

export async function deleteWallet(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Bejelentkezés szükséges' }

    // Check if wallet has transactions
    const { count, error: countError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('wallet_id', id)

    if (countError) return { error: countError.message }
    if (count && count > 0) {
        return { error: 'Nem törölhető olyan tárca, amelyhez tranzakciók tartoznak. Előbb töröld vagy mozgasd át a tranzakciókat!' }
    }

    const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
}
