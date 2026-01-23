-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view their own categories"
    ON categories FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Insert default categories (shared, user_id = NULL)
INSERT INTO categories (user_id, name, type, icon, color) VALUES
    (NULL, 'Fizetés', 'income', '💰', '#10b981'),
    (NULL, 'Befektetés', 'income', '📈', '#3b82f6'),
    (NULL, 'Ajándék', 'income', '🎁', '#8b5cf6'),
    (NULL, 'Lakhatás', 'expense', '🏠', '#ef4444'),
    (NULL, 'Étel', 'expense', '🍔', '#f59e0b'),
    (NULL, 'Közlekedés', 'expense', '🚗', '#06b6d4'),
    (NULL, 'Szórakozás', 'expense', '🎮', '#ec4899'),
    (NULL, 'Egészség', 'expense', '💊', '#14b8a6'),
    (NULL, 'Ruházat', 'expense', '👕', '#a855f7'),
    (NULL, 'Oktatás', 'expense', '📚', '#6366f1')
ON CONFLICT DO NOTHING;
