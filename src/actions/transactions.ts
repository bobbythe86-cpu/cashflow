'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType, Transaction, Wallet, Budget, SavingsGoal } from '@/types'
import { syncRecurringTransactions } from './recurring'
import { generateInsights } from './advisor'
import { updateMilestoneProgress } from './milestones'

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
    const { data: transactions } = await supabase.from('transactions').select('*, category:categories(*)').eq('user_id', user.id).order('date', { ascending: false })
    const { data: wallets } = await supabase.from('wallets').select('*').eq('user_id', user.id)
    return (transactions || []).map(t => ({
        ...t,
        wallet: wallets?.find(w => w.id === t.wallet_id) || null,
        to_wallet: wallets?.find(w => w.id === t.to_wallet_id) || null
    }))
}

export async function getDashboardStats() {
    await syncRecurringTransactions()
    let transactions: Transaction[] = []
    let wallets: Wallet[] = []
    let budgets: Budget[] = []
    let savingsGoals: SavingsGoal[] = []
    let totalWalletBalance = 0
    const now = new Date()

    if (isConfigured()) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const [transRes, walletRes, budgetRes, savingsRes] = await Promise.all([
                supabase.from('transactions').select('*, category:categories(*)').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('wallets').select('*').eq('user_id', user.id),
                supabase.from('budgets').select('*, category:categories(*)').eq('user_id', user.id).eq('month', now.getMonth() + 1).eq('year', now.getFullYear()),
                supabase.from('savings_goals').select('*').eq('user_id', user.id).limit(3)
            ])

            const rawTransactions = transRes.data || []
            wallets = (walletRes.data as Wallet[]) || []
            budgets = (budgetRes.data as Budget[]) || []
            savingsGoals = (savingsRes.data as SavingsGoal[]) || []
            transactions = rawTransactions.map(t => ({ ...t, wallet: wallets.find(w => w.id === t.wallet_id) || null }))
            totalWalletBalance = wallets.reduce((acc, w) => acc + w.balance, 0)
        }
    } else {
        transactions = MOCK_TRANSACTIONS
    }

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthTransactions = transactions.filter(t => new Date(t.date) >= startOfCurrentMonth)

    const monthlyExpensesByCategory = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            if (t.category_id) acc[t.category_id] = (acc[t.category_id] || 0) + t.amount
            return acc
        }, {} as Record<string, number>)

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const lastMonthTransactions = transactions.filter(t => {
        const d = new Date(t.date)
        return d >= startOfLastMonth && d <= endOfLastMonth
    })

    const monthlyIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
    const monthlyExpenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
    const lastMonthlyIncome = lastMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
    const lastMonthlyExpenses = lastMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)

    const totalBalance = isConfigured() ? totalWalletBalance : (monthlyIncome - monthlyExpenses)
    const incomeGrowth = lastMonthlyIncome === 0 ? 0 : ((monthlyIncome - lastMonthlyIncome) / lastMonthlyIncome) * 100
    const expenseGrowth = lastMonthlyExpenses === 0 ? 0 : ((monthlyExpenses - lastMonthlyExpenses) / lastMonthlyExpenses) * 100

    const insights = await generateInsights(
        transactions,
        budgets,
        savingsGoals,
        monthlyExpensesByCategory
    )

    return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        incomeGrowth,
        expenseGrowth,
        recentTransactions: transactions.slice(0, 5),
        chartData: transactions.map(t => ({ date: t.date, amount: t.amount, type: t.type })),
        wallets,
        budgets,
        monthlyExpensesByCategory,
        savingsGoals,
        insights
    }
}

export async function createTransaction(formData: FormData) {
    if (!isConfigured()) return { success: true }
    const supabase = createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as TransactionType
    const category_id = formData.get('category_id') as string
    const wallet_id = formData.get('wallet_id') as string
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }
    const { error } = await supabase.from('transactions').insert({ user_id: user.id, amount, description, date, type, category_id: category_id || null, wallet_id: wallet_id || null })
    if (error) return { error: error.message }

    // Check milestones
    await updateMilestoneProgress(user.id, 'first_transaction')

    revalidatePath('/dashboard'); revalidatePath('/transactions'); return { success: true }
}

export async function deleteTransaction(id: string) {
    if (!isConfigured()) return { success: true }
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/dashboard'); revalidatePath('/transactions'); return { success: true }
}

export async function updateTransaction(id: string, formData: FormData) {
    if (!isConfigured()) return { success: true }
    const supabase = createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const type = formData.get('type') as TransactionType
    const category_id = formData.get('category_id') as string
    const wallet_id = formData.get('wallet_id') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    const { error } = await supabase
        .from('transactions')
        .update({
            amount,
            description,
            date,
            type,
            category_id: category_id || null,
            wallet_id: wallet_id || null
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    return { success: true }
}

export async function transferFunds(formData: FormData) {
    if (!isConfigured()) return { success: true }
    const supabase = createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const from_wallet_id = formData.get('from_wallet_id') as string
    const to_wallet_id = formData.get('to_wallet_id') as string

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Bejelentkezés szükséges' }

    // Check if source wallet has enough funds
    const { data: fromWallet } = await supabase
        .from('wallets')
        .select('balance, name')
        .eq('id', from_wallet_id)
        .single()

    if (fromWallet && fromWallet.balance < amount) {
        return { error: `Nincs elég fedezet a(z) ${fromWallet.name} pénztárcában!` }
    }

    // A transfer is a single transaction with wallet_id (from) and to_wallet_id (to)
    // The database trigger handles updating both balances
    const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        amount,
        description: description || 'Átvezetés',
        date,
        type: 'expense',
        wallet_id: from_wallet_id,
        to_wallet_id: to_wallet_id,
        category_id: null // System movement
    })

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    revalidatePath('/transactions')
    revalidatePath('/wallets')
    return { success: true }
}
