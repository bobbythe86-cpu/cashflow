'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SavingsGoal } from '@/types'
import { updateMilestoneProgress } from './milestones'

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
    const image = formData.get('image') as File | null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    let image_url = null

    if (image && image.size > 0) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
            .from('savings')
            .upload(fileName, image)

        if (uploadError) {
            console.error('Image upload failed:', uploadError)
        } else {
            const { data: publicUrlData } = supabase.storage
                .from('savings')
                .getPublicUrl(fileName)
            image_url = publicUrlData.publicUrl
        }
    }

    const { error } = await supabase.from('savings_goals').insert({
        user_id: user.id,
        name,
        target_amount,
        current_amount,
        deadline: deadline || null,
        color: color || 'hsl(var(--primary))',
        image_url
    })

    if (error) return { error: error.message }

    await updateMilestoneProgress(user.id, 'saving_starter')

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateSavingsAmount(id: string, newAmount: number, walletId: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    // 1. Get current goal state
    const { data: goal, error: fetchError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !goal) return { error: 'Cél nem található' }

    const diff = newAmount - goal.current_amount
    if (diff === 0) return { success: true }

    // 2. Get wallet
    const { data: wallet, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single()

    if (walletError || !wallet) return { error: 'Pénztárca nem található' }

    // 3. Check wallet balance
    // If diff is positive (adding 5000 to savings), we check if wallet has enough
    const newWalletBalance = wallet.balance - diff

    // Check if wallet has enough funds when adding to savings
    if (diff > 0 && newWalletBalance < 0) {
        return { error: 'Nincs elég fedezet a kiválasztott pénztárcában!' }
    }

    // We do NOT manually update wallet balance here, because inserting the transaction (Step 5)
    // will trigger the automatic balance update via database triggers.

    // 4. Update savings goal
    const { error: updateGoalError } = await supabase
        .from('savings_goals')
        .update({ current_amount: newAmount })
        .eq('id', id)

    if (updateGoalError) return { error: updateGoalError.message }

    // 5. Create transaction record for history
    await supabase.from('transactions').insert({
        user_id: user.id,
        amount: Math.abs(diff),
        type: diff > 0 ? 'expense' : 'income', // Expense from wallet pov when saving, Income to wallet when withdrawing
        description: diff > 0
            ? `Megtakarítás: ${goal.name}`
            : `Kivét megtakarításból: ${goal.name}`,
        wallet_id: walletId,
        date: new Date().toISOString().split('T')[0],
        category_id: null // Special system movement
    })

    // Check if goal reached target
    if (goal.current_amount < goal.target_amount && newAmount >= goal.target_amount) {
        await updateMilestoneProgress(user.id, 'consistent_saver')
    }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}

export async function deleteSavingsGoal(id: string, returnToWalletId?: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    // If we need to return funds, we must fetch the goal first
    if (returnToWalletId) {
        const { data: goal, error: fetchError } = await supabase
            .from('savings_goals')
            .select('*')
            .eq('id', id)
            .single()

        if (!fetchError && goal && goal.current_amount > 0) {
            // Create transaction record to return funds
            await supabase.from('transactions').insert({
                user_id: user.id,
                amount: goal.current_amount,
                type: 'income',
                description: `Megtakarítás visszatöltése: ${goal.name}`,
                wallet_id: returnToWalletId,
                date: new Date().toISOString().split('T')[0],
                category_id: null
            })
        }
    }

    const { error } = await supabase.from('savings_goals').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}

export async function updateRecurringSettings(
    goalId: string,
    enabled: boolean,
    frequency?: 'daily' | 'weekly' | 'monthly',
    amount?: number,
    walletId?: string
) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    // Calculate next recurring date based on frequency
    let nextDate = null
    if (enabled && frequency) {
        const now = new Date()
        switch (frequency) {
            case 'daily':
                now.setDate(now.getDate() + 1)
                break
            case 'weekly':
                now.setDate(now.getDate() + 7)
                break
            case 'monthly':
                now.setMonth(now.getMonth() + 1)
                break
        }
        nextDate = now.toISOString().split('T')[0]
    }

    const { error } = await supabase
        .from('savings_goals')
        .update({
            recurring_enabled: enabled,
            recurring_frequency: enabled ? frequency : null,
            recurring_amount: enabled ? amount : null,
            recurring_wallet_id: enabled ? walletId : null,
            next_recurring_date: nextDate
        })
        .eq('id', goalId)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/savings')
    revalidatePath('/dashboard')
    return { success: true }
}
