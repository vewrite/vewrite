-- Create sequence for stateinstances id
CREATE SEQUENCE IF NOT EXISTS stateinstances_stateinstance_id_seq;

-- Create stateinstances table
CREATE TABLE IF NOT EXISTS stateinstances (
  id int8 PRIMARY KEY DEFAULT nextval('stateinstances_stateinstance_id_seq'),
  instance_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL,
  state_type numeric NOT NULL,
  assigned_to uuid NOT NULL,
  actions jsonb array NOT NULL
);

-- Enable Row Level Security
ALTER TABLE stateinstances ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON stateinstances
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');