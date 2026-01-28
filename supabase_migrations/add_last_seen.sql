-- Add last_seen_at to profiles
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add role to profiles if it doesn't exist (it seems it exists based on admin.ts)
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
