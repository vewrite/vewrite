-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY, -- No default value, as it references auth.users
  updated_at timestamptz DEFAULT now(),
  username text NOT NULL,
  first_time boolean DEFAULT true,
  avatar_url text,
  website text,
  email text,
  persona text DEFAULT 'manager',
  subscription jsonb DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public to view profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Create a policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Enable real-time updates for the profiles table
ALTER TABLE profiles REPLICA IDENTITY FULL;