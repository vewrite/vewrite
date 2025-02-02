-- Create sequence for stakeholder id
CREATE SEQUENCE IF NOT EXISTS stakeholders_stakeholder_id_seq;

-- Create stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
  id int8 PRIMARY KEY DEFAULT nextval('stakeholders_stakeholder_id_seq'),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  projects jsonb array NOT NULL,
  profile_id uuid NOT NULL
);

-- Enable Row Level Security
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON stakeholders
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');