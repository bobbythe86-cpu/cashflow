-- Add recurring payment fields to savings_goals
ALTER TABLE savings_goals 
ADD COLUMN IF NOT EXISTS recurring_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly')),
ADD COLUMN IF NOT EXISTS recurring_amount DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS recurring_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS next_recurring_date DATE;

-- Create index for efficient querying of due recurring payments
CREATE INDEX IF NOT EXISTS idx_savings_recurring_due 
ON savings_goals(next_recurring_date) 
WHERE recurring_enabled = true;

COMMENT ON COLUMN savings_goals.recurring_enabled IS 'Whether automatic recurring payments are enabled';
COMMENT ON COLUMN savings_goals.recurring_frequency IS 'Frequency of automatic payments: daily, weekly, monthly';
COMMENT ON COLUMN savings_goals.recurring_amount IS 'Amount to transfer automatically';
COMMENT ON COLUMN savings_goals.recurring_wallet_id IS 'Source wallet for automatic transfers';
COMMENT ON COLUMN savings_goals.next_recurring_date IS 'Next scheduled automatic payment date';
