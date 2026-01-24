-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('bank', 'cash', 'savings', 'credit')),
    balance DECIMAL DEFAULT 0 NOT NULL,
    currency TEXT DEFAULT 'HUF' NOT NULL,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Policies for wallets
CREATE POLICY "Users can view their own wallets" 
    ON wallets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets" 
    ON wallets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" 
    ON wallets FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets" 
    ON wallets FOR DELETE 
    USING (auth.uid() = user_id);

-- Modify transactions table (add columns if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='wallet_id') THEN
        ALTER TABLE transactions ADD COLUMN wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='to_wallet_id') THEN
        ALTER TABLE transactions ADD COLUMN to_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Data initialization with dynamic SQL to avoid "column does not exist" parse error
DO $$
DECLARE
    user_record RECORD;
    new_wallet_id UUID;
BEGIN
    FOR user_record IN SELECT id FROM auth.users LOOP
        -- Check if user already has any wallet
        SELECT id INTO new_wallet_id FROM wallets WHERE user_id = user_record.id LIMIT 1;
        
        -- If user has no wallet, create a default one
        IF new_wallet_id IS NULL THEN
            INSERT INTO wallets (user_id, name, type, balance, currency)
            VALUES (user_record.id, 'Fő pénztárca', 'cash', 0, 'HUF')
            RETURNING id INTO new_wallet_id;
        END IF;
            
        -- Use EXECUTE to bypass static parse error for the newly created column
        EXECUTE format('UPDATE transactions SET wallet_id = %L WHERE user_id = %L AND wallet_id IS NULL', new_wallet_id, user_record.id);
    END LOOP;
END $$;
