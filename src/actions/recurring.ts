'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { RecurringFrequency, TransactionType } from '@/types'

const isConfigured = () =>
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

export async function getRecurringTransactions() {
    if (!isConfigured()) return []

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error || !data) {
        console.error('Error fetching recurring transactions:', error)
        return []
    }

    return data
}

import { addDays, addWeeks, addMonths, addYears, parseISO, format, startOfToday, startOfDay, isBefore, isEqual, isAfter } from 'date-fns'

export async function syncRecurringTransactions() {
    if (!isConfigured()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: recurring, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

    if (error || !recurring) return

    const today = startOfToday()

    for (const item of recurring) {
        let currentDate = startOfDay(parseISO(item.next_date || item.start_date))

        while (isBefore(currentDate, today) || isEqual(currentDate, today)) {
            // Create transaction
            await supabase.from('transactions').insert({
                user_id: user.id,
                amount: item.amount,
                description: `${item.description} (Rendszeres)`,
                category_id: item.category_id,
                date: format(currentDate, 'yyyy-MM-dd'),
                type: item.type
            })

            // Calculate next date
            if (item.frequency === 'daily') currentDate = addDays(currentDate, 1)
            else if (item.frequency === 'weekly') currentDate = addWeeks(currentDate, 1)
            else if (item.frequency === 'monthly') currentDate = addMonths(currentDate, 1)
            else if (item.frequency === 'yearly') currentDate = addYears(currentDate, 1)

            // Break if it goes beyond today
            if (isAfter(currentDate, today)) break
        }

        // Update the recurring entry with the next date
        await supabase
            .from('recurring_transactions')
            .update({ next_date: format(currentDate, 'yyyy-MM-dd') })
            .eq('id', item.id)
    }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
}

export async function createRecurringTransaction(formData: FormData) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const category_id = formData.get('category_id') as string
    const type = formData.get('type') as TransactionType
    const frequency = formData.get('frequency') as RecurringFrequency
    const start_date = formData.get('start_date') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase.from('recurring_transactions').insert({
        user_id: user.id,
        amount,
        description,
        category_id: category_id || null,
        type,
        frequency,
        start_date,
        is_active: true
    })

    if (error) return { error: error.message }

    revalidatePath('/recurring')
    return { success: true }
}

export async function toggleRecurringStatus(id: string, currentStatus: boolean) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase
        .from('recurring_transactions')
        .update({ is_active: !currentStatus })
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/recurring')
    return { success: true }
}

export async function deleteRecurringTransaction(id: string) {
    if (!isConfigured()) return { success: true }

    const supabase = createClient()
    const { error } = await supabase
        .from('recurring_transactions')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/recurring')
    return { success: true }
}
