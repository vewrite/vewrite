-- Create sequence for roles id
CREATE SEQUENCE IF NOT EXISTS roles_role_id_seq;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id int8 PRIMARY KEY DEFAULT nextval('roles_role_id_seq'),
  name text NOT NULL,
  description text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON roles
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');