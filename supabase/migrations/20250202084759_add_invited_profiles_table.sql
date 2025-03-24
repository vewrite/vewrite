-- Create invited_profiles table
CREATE TABLE IF NOT EXISTS invited_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  project_id uuid NOT NULL
);

-- Enable Row Level Security
ALTER TABLE invited_profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON invited_profiles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable real-time updates for the invited_profiles table
ALTER TABLE invited_profiles REPLICA IDENTITY FULL;