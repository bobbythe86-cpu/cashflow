'use server'

import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from './transactions'
import { getBudgets } from './budgets'
import { getRecurringTransactions } from './recurring'
import { addMonths, format } from 'date-fns'
import { hu } from 'date-fns/locale'

export interface ForecastData {
    monthName: string;
    label: string;
    income: number;
    expenses: number;
    balance: number;
}

export async function getCashflowForecast() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // 1. Get current state
    const stats = await getDashboardStats()
    const recurring = await getRecurringTransactions()

    // 2. Prepare forecast
    let currentBalance = stats.totalBalance
    const forecast: ForecastData[] = []
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

export async function getFIREData() {
    const stats = await getDashboardStats()
    const monthlyExpenses = stats.monthlyExpenses || 1 // Avoid division by zero
    const monthlyIncome = stats.monthlyIncome
    const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses)

    // 4% Rule: FIRE Number = Monthly Expenses * 12 * 25
    const fireTarget = monthlyExpenses * 12 * 25
    const currentAssets = stats.totalBalance
    const progress = Math.min(Math.round((currentAssets / fireTarget) * 100), 100)

    // Years to FIRE: (Target - Current) / (Monthly Savings * 12)
    const yearlySavings = monthlySavings * 12
    const yearsRemaining = yearlySavings > 0
        ? Math.max(0, (fireTarget - currentAssets) / yearlySavings)
        : Infinity

    return {
        fireTarget,
        currentAssets,
        monthlySavings,
        progress,
        yearsRemaining,
        monthlyExpenses
    }
}

export async function getEmergencyFundRecommendation() {
    const stats = await getDashboardStats()
    const avgMonthlyExpenses = stats.monthlyExpenses || 0

    return {
        threeMonths: avgMonthlyExpenses * 3,
        sixMonths: avgMonthlyExpenses * 6,
        currentExpenses: avgMonthlyExpenses
    }
}
