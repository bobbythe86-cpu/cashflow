'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType, Transaction } from '@/types'
import { syncRecurringTransactions } from './recurring'

// Segédfüggvény a konfiguráció ellenőrzéséhez
const isConfigured = () =>
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')

const MOCK_TRANSACTIONS = [
    { id: '1', user_id: 'demo', category_id: '1', amount: 450000, description: 'Havi fizetés', date: '2024-01-20', type: 'income' as const, created_at: new Date().toISOString(), category: { id: '1', user_id: 'demo', name: 'Fizetés', type: 'income' as const, icon: 'wallet', color: 'blue', created_at: new Date().toISOString() } },
    { id: '2', user_id: 'demo', category_id: '2', amount: 120000, description: 'Albérlet', date: '2024-01-05', type: 'expense' as const, created_at: new Date().toISOString(), category: { id: '2', user_id: 'demo', name: 'Lakhatás', type: 'expense' as const, icon: 'home', color: 'red', created_at: new Date().toISOString() } },
    { id: '3', user_id: 'demo', category_id: '3', amount: 15000, description: 'Bevásárlás', date: '2024-01-18', type: 'expense' as const, created_at: new Date().toISOString(), category: { id: '3', user_id: 'demo', name: 'Étel', type: 'expense' as const, icon: 'shopping-cart', color: 'green', created_at: new Date().toISOString() } },
    { id: '4', user_id: 'demo', category_id: '4', amount: 8000, description: 'Netflix', date: '2024-01-10', type: 'expense' as const, created_at: new Date().toISOString(), category: { id: '4', user_id: 'demo', name: 'Szórakozás', type: 'expense' as const, icon: 'play', color: 'purple', created_at: new Date().toISOString() } },
    { id: '5', user_id: 'demo', category_id: '3', amount: 25000, description: 'Vacsora', date: '2024-01-22', type: 'expense' as const, created_at: new Date().toISOString(), category: { id: '3', user_id: 'demo', name: 'Étel', type: 'expense' as const, icon: 'shopping-cart', color: 'green', created_at: new Date().toISOString() } },
] as Transaction[]

export async function getTransactions() {
    if (!isConfigured()) return MOCK_TRANSACTIONS

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('transactions')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    if (error || !data) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data
}

export async function getDashboardStats() {
    await syncRecurringTransactions()
    let transactions: Transaction[] = []

    if (isConfigured()) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data } = await supabase
                .from('transactions')
                .select('*, category:categories(*)')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
            transactions = data || []
        }
    } else {
        transactions = MOCK_TRANSACTIONS
    }

    // Filter for current month's stats
    const now = new Date()
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= startOfCurrentMonth)

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const lastMonthTransactions = transactions.filter(t => {
        const d = new Date(t.date)
        return d >= startOfLastMonth && d <= endOfLastMonth
    })

    const monthlyIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0)

    const monthlyExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    const lastMonthlyIncome = lastMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0)

    const lastMonthlyExpenses = lastMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    // Total balance remains aggregate of all transactions
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalBalance = totalIncome - totalExpenses

    // Calculate growth percentage
    const incomeGrowth = lastMonthlyIncome === 0 ? 0 : ((monthlyIncome - lastMonthlyIncome) / lastMonthlyIncome) * 100
    const expenseGrowth = lastMonthlyExpenses === 0 ? 0 : ((monthlyExpenses - lastMonthlyExpenses) / lastMonthlyExpenses) * 100

    const chartData = transactions.map(t => ({
        date: t.date,
        amount: t.amount,
        type: t.type
    }))

    return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        incomeGrowth,
        expenseGrowth,
        recentTransactions: transactions.slice(0, 5),
        chartData
    }
}

export async function createTransaction(formData: FormData) {
    if (!isConfigured()) {
        console.log('Demo mód: Tranzakció mentése szimulálva')
        revalidatePath('/dashboard')
        revalidatePath('/transactions')
        return { success: true }
    }

    const supabase = createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as TransactionType
    const category_id = formData.get('category_id') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount,
        description,
        date,
        type,
        category_id: category_id || null,
    })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}

export async function deleteTransaction(id: string) {
    if (!isConfigured()) {
        console.log('Demo mód: Törlés szimulálva')
        return { success: true }
    }

    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}
