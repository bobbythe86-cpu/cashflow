-- Add status and completed_at to savings_goals
ALTER TABLE savings_goals 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Update existing records to 'active'
UPDATE savings_goals SET status = 'active' WHERE status IS NULL;
