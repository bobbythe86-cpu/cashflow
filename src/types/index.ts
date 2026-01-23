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

export interface Transaction {
    id: string;
    user_id: string;
    category_id: string | null;
    amount: number;
    description: string | null;
    date: string;
    type: TransactionType;
    created_at: string;
    category?: Category;
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
}
export * from './suggestions';
