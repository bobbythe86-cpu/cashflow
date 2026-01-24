'use server'

import { Budget, Insight, SavingsGoal, Transaction } from "@/types"
import { startOfMonth, subMonths, isWithinInterval } from "date-fns"

export async function generateInsights(
    transactions: Transaction[],
    budgets: Budget[],
    savingsGoals: SavingsGoal[],
    monthlyExpensesByCategory: Record<string, number>
): Promise<Insight[]> {
    const insights: Insight[] = []
    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))

    // 1. Budget Alerts
    budgets.forEach(budget => {
        const spent = monthlyExpensesByCategory[budget.category_id] || 0
        const percent = (spent / budget.amount) * 100

        if (percent >= 100) {
            insights.push({
                id: `budget-over-${budget.id}`,
                title: `Költségkeret túllépés: ${budget.category?.name}`,
                description: `Már ${Math.round(percent - 100)}%-kal többet költöttél erre, mint amit terveztél. Érdemes visszafogni a kiadásokat ebben a hónapban.`,
                type: 'warning',
                priority: 'high',
                category_id: budget.category_id
            })
        } else if (percent >= 85) {
            insights.push({
                id: `budget-near-${budget.id}`,
                title: `Közeledsz a keretedhez: ${budget.category?.name}`,
                description: `A havi keret ${Math.round(percent)}%-át már felhasználtad. Még ${(budget.amount - spent).toLocaleString()} Ft maradt.`,
                type: 'info',
                priority: 'medium',
                category_id: budget.category_id
            })
        }
    })

    // 2. Spending Trends
    const lastMonthExpenses = transactions
        .filter(t => t.type === 'expense' && isWithinInterval(new Date(t.date), { start: startOfLastMonth, end: startOfCurrentMonth }))
        .reduce((sum, t) => sum + t.amount, 0)

    const currentMonthExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.date) >= startOfCurrentMonth)
        .reduce((sum, t) => sum + t.amount, 0)

    if (currentMonthExpenses > lastMonthExpenses && lastMonthExpenses > 0) {
        insights.push({
            id: 'trend-spending-up',
            title: 'Növekvő kiadások',
            description: `Az eddigi költéseid már most meghaladják a múlt havi teljes összeget. Nézzük át, hol lehetne faragni belőle!`,
            type: 'trend',
            priority: 'medium'
        })
    }

    // 3. Savings Goal Progress
    savingsGoals.forEach(goal => {
        const percent = (goal.current_amount / goal.target_amount) * 100
        if (percent >= 90 && percent < 100) {
            insights.push({
                id: `savings-near-${goal.id}`,
                title: `Majdnem megvagy: ${goal.name}!`,
                description: `Már csak ${(goal.target_amount - goal.current_amount).toLocaleString()} Ft hiányzik a célod eléréséhez. Szuper a tempód!`,
                type: 'success',
                priority: 'high'
            })
        }
    })

    // 4. Emergency Fund Tip (If no goals or low total balance)
    const totalBalance = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)
    if (totalBalance < currentMonthExpenses * 2 && totalBalance > 0) {
        insights.push({
            id: 'tip-emergency-fund',
            title: 'Pénzügyi biztonsági háló',
            description: 'A jelenlegi egyenleged kevesebb, mint 2 havi kiadásod. Javasolt egy 3-6 havi tartalékalap felépítése váratlan helyzetekre.',
            type: 'info',
            priority: 'medium'
        })
    }

    return insights.sort((a, b) => {
        const priorityScore = { high: 3, medium: 2, low: 1 }
        return priorityScore[b.priority] - priorityScore[a.priority]
    }).slice(0, 4) // Show top 4 most important insights
}
