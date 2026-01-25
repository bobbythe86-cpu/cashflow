-- Add image_url column to savings_goals
ALTER TABLE savings_goals ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for savings goals
INSERT INTO storage.buckets (id, name, public) 
VALUES ('savings', 'savings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Savings images are publicly accessible"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'savings' );

CREATE POLICY "Users can upload savings images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'savings' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can update their own savings images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'savings' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

CREATE POLICY "Users can delete their own savings images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'savings' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );
