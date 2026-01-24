-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL NOT NULL DEFAULT 0,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Ensure only one budget per category per month
    UNIQUE(user_id, category_id, month, year)
);

-- Enable RLS for budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Policies for budgets
CREATE POLICY "Users can view their own budgets" 
    ON budgets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budgets" 
    ON budgets FOR ALL 
    USING (auth.uid() = user_id);
