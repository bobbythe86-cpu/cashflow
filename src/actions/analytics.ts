'use server'

import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from './transactions'
import { getBudgets } from './budgets'
import { getRecurringTransactions } from './recurring'
import { addMonths, format, startOfMonth } from 'date-fns'
import { hu } from 'date-fns/locale'

export async function getCashflowForecast() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Get current state
    const stats = await getDashboardStats()
    const recurring = await getRecurringTransactions()

    // 2. Prepare forecast
    let currentBalance = stats.totalBalance
    const forecast = []
    const now = new Date()

    // We forecast for the next 3 months (including the rest of the current one)
    for (let i = 0; i < 4; i++) {
        const targetDate = addMonths(now, i)
        const month = targetDate.getMonth() + 1
        const year = targetDate.getFullYear()

        // Get budgets for this month
        const budgets = await getBudgets(month, year)
        const totalBudgetedExpenses = budgets.reduce((acc, b) => acc + b.amount, 0)

        // Get recurring for this month
        const monthlyRecurringIncome = recurring
            .filter(r => r.type === 'income' && r.is_active)
            .reduce((acc, r) => acc + r.amount, 0)

        const monthlyRecurringExpenses = recurring
            .filter(r => r.type === 'expense' && r.is_active)
            .reduce((acc, r) => acc + r.amount, 0)

        // For the current month (i=0), we should only consider what's left
        // But for simplicity in this version, we'll show full months for future
        // and current balance + expected movements for the current one.

        if (i > 0) {
            currentBalance += monthlyRecurringIncome
            currentBalance -= Math.max(totalBudgetedExpenses, monthlyRecurringExpenses)
        }

        forecast.push({
            monthName: format(targetDate, 'MMMM', { locale: hu }),
            label: format(targetDate, 'yyyy. MMM', { locale: hu }),
            income: monthlyRecurringIncome,
            expenses: Math.max(totalBudgetedExpenses, monthlyRecurringExpenses),
            balance: currentBalance,
        })
    }

    return forecast
}
