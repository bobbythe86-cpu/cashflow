export type TransactionType = 'income' | 'expense';

export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    role: 'user' | 'admin';
    updated_at: string;
}

export interface Category {
    id: string;
    user_id: string | null;
    name: string;
    type: TransactionType;
    icon: string | null;
    color: string | null;
    created_at: string;
}

export interface Budget {
    id: string;
    user_id: string;
    category_id: string;
    amount: number;
    month: number;
    year: number;
    created_at: string;
    category?: Category;
}

export type WalletType = 'bank' | 'cash' | 'savings' | 'credit';

export interface Wallet {
    id: string;
    user_id: string;
    name: string;
    type: WalletType;
    balance: number;
    currency: string;
    color: string | null;
    created_at: string;
}

export interface Transaction {
    id: string;
    user_id: string;
    category_id: string | null;
    wallet_id: string | null;
    to_wallet_id?: string | null;
    amount: number;
    description: string | null;
    date: string;
    type: TransactionType;
    created_at: string;
    category?: Category;
    wallet?: Wallet;
}

export interface SavingsGoal {
    id: string;
    user_id: string;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline: string | null;
    color: string;
    icon: string;
    image_url?: string | null;
    recurring_enabled?: boolean;
    recurring_frequency?: 'daily' | 'weekly' | 'monthly';
    recurring_amount?: number;
    recurring_wallet_id?: string | null;
    next_recurring_date?: string | null;
    created_at: string;
    updated_at: string;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
    id: string;
    user_id: string;
    category_id: string | null;
    amount: number;
    description: string | null;
    type: TransactionType;
    frequency: RecurringFrequency;
    start_date: string;
    next_date: string | null;
    is_active: boolean;
    created_at: string;
    category?: Category;
}

export interface DashboardStats {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    incomeGrowth: number;
    expenseGrowth: number;
    recentTransactions: Transaction[];
    chartData: { date: string; amount: number; type: TransactionType }[];
    wallets: Wallet[];
    budgets: Budget[];
    monthlyExpensesByCategory: Record<string, number>;
    savingsGoals: SavingsGoal[];
    insights: Insight[];
}

export interface Insight {
    id: string;
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success' | 'trend';
    priority: 'low' | 'medium' | 'high';
    category_id?: string;
}
export * from './suggestions';
