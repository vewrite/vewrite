-- Create sequence for workflows id
CREATE SEQUENCE IF NOT EXISTS workflows_workflow_id_seq;

-- Create workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id int8 PRIMARY KEY DEFAULT nextval('workflows_workflow_id_seq'),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  states jsonb NOT NULL,
  type numeric NOT NULL,
  completion_step numeric NOT NULL
);

-- Enable Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON workflows
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Seed data
INSERT INTO workflows (name, description, states, type, completion_step) VALUES
('Default Workflow', 'This is the standard Vewrite workflow. It is appropriate for small to medium sized teams who are writing content pieces for external stakeholder clients.', '[43, 44, 45, 46, 47, 48, 49]', 1, 6);
