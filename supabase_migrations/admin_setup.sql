-- Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update RLS for profiles: Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        auth.uid() = id OR 
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Update RLS for suggestions: Allow admins to view all suggestions
DROP POLICY IF EXISTS "Admins can view all suggestions" ON suggestions;
CREATE POLICY "Admins can view all suggestions"
    ON suggestions FOR SELECT
    USING (
        auth.uid() = user_id OR 
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

-- Update RLS for suggestions: Allow admins to delete/update suggestions (optional)
CREATE POLICY "Admins can update suggestions"
    ON suggestions FOR UPDATE
    USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Set a specific user as admin (you will need to run this with your actual user ID)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
