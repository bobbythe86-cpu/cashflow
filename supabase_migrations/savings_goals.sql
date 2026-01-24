-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL DEFAULT 0 NOT NULL,
    deadline DATE,
    color TEXT DEFAULT 'hsl(var(--primary))',
    icon TEXT DEFAULT 'target',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own savings goals" 
    ON savings_goals FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own savings goals" 
    ON savings_goals FOR ALL 
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_savings_goals_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_savings_goals_modtime
    BEFORE UPDATE ON savings_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_savings_goals_modtime();
