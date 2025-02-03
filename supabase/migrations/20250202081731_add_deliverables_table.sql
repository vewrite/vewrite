-- Create sequence for deliverables id
CREATE SEQUENCE IF NOT EXISTS deliverables_deliverable_id_seq;

-- Create deliverables table
CREATE TABLE IF NOT EXISTS deliverables (
  id int8 PRIMARY KEY DEFAULT nextval('deliverables_deliverable_id_seq'),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  due_date timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  project int8 NOT NULL,
  workflow_state int8 NOT NULL,
  content jsonb NOT NULL,
  role_assignments jsonb NOT NULL,
  assigned_to uuid,
);

-- Enable Row Level Security
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON deliverables
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable real-time updates for the deliverables table
ALTER TABLE deliverables REPLICA IDENTITY FULL;