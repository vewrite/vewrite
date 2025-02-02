-- Create sequence for projects id
CREATE SEQUENCE IF NOT EXISTS projects_project_id_seq;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id int8 PRIMARY KEY DEFAULT nextval('projects_project_id_seq'),
  name text NOT NULL,
  description text,
  status int2 NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  workflow numeric NOT NULL,
  client_id uuid NOT NULL,
  assigned_team uuid NOT NULL
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON projects
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable real-time updates for the projects table
ALTER TABLE projects REPLICA IDENTITY FULL;