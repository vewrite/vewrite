-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  team_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role numeric NOT NULL DEFAULT 1,
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON team_members
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');