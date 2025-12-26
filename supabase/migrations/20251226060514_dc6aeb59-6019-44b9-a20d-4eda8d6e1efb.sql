-- Add foreign key constraint to settings table for referential integrity
ALTER TABLE public.settings
ADD CONSTRAINT settings_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;