-- Create sequence for client_id
CREATE SEQUENCE IF NOT EXISTS clients_client_id_seq;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  client_id int8 PRIMARY KEY DEFAULT nextval('clients_client_id_seq'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL,
  logo_url text NOT NULL,
  name text NOT NULL,
  personal bool NOT NULL DEFAULT false,
);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow upserts for authorized users
CREATE POLICY "Upsert allowed for authorized users" ON clients
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable real-time updates for the clients table
ALTER TABLE clients REPLICA IDENTITY FULL;