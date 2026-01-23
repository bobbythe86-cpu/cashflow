-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'implemented')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert suggestions" 
    ON suggestions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Users can see their own suggestions" 
    ON suggestions FOR SELECT 
    USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM auth.users WHERE email = 'admin@example.com')); -- Placeholder for admin access
