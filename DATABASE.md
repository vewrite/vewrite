# Vewrite Database Schema

## Database Schema for Profiles

```sql
-- Create a table for public "profiles"
create table profiles (
  id uuid references auth.users not null,
  updated_at timestamp with time zone,
  username text unique,
  firstTime boolean,
  avatar_url text,
  website text,
  email text,
  persona text,

  primary key (id),
  unique(email),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Set up Realtime!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table profiles;

-- Set up Storage!
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
```

## Database Schema for Clients

```sql
-- Create a table for public "clients"
create table clients (
  id uuid int8,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_by uuid,
  logo_url text,
  name text,

  primary key (id),
  unique(name),
  constraint name_length check (char_length(username) >= 3)
);

alter table clients enable row level security;

create policy "Upsert allowed for authorized users"
  on clients for select
  using (auth.uid() IS NOT NULL);

```

## Database Schema for Deliverables

```sql
-- Create a table for public "deliverables"
create table deliverables (
  id uuid int8,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  due_date timestamp with time zone,
  created_by uuid,
  title text,
  description text,
  project int8,
  workflow_state int8,
  file text,
  link text,
  markdown text,


  primary key (id)
);

alter table deliverables enable row level security;

create policy "Enable read access for all users"
  on deliverables for select
  using (auth.uid() IS NOT NULL);

```


## Database Schema for Projects

```sql
-- Create a table for public "projects"
create table projects (
  id uuid int8,
  name text,
  description text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_by uuid,
  workflow numeric,
  stakeholders json
  client numeric,
  deliverables int8 array,

  primary key (id)
);

alter table projects enable row level security;

create policy "Enable read access for all users"
  on projects for select
  using (auth.uid() IS NOT NULL);

```

## Database Schema for Statetypes

```sql
-- Create a table for public "states"
create table statetypes (
  id uuid int8,
  name text,
  description text,
  icon text,
  is_default boolean,

  primary key (id)
);

alter table statetypes enable row level security;

create policy "Enable read access for all users"
  on statetypes for select
  using (auth.uid() IS NOT NULL);

```

## Database Schema for Stateinstances

```sql
-- Create a table for public "states"
create table stateinstances (
  id uuid int8,
  created_at timestamp with time zone,
  statetype numeric,
  created_by uuid,
  assigned_to uuid,
  actions json,

  primary key (id)
);

alter table statetypes enable row level security;

create policy "Enable read access for all users"
  on stateinstances for select
  using (auth.uid() IS NOT NULL);


## Database Schema for Workflows

```sql
-- Create a table for public "workflows"
create table workflows (
  id uuid int8,
  name text,
  description text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_by uuid,
  states int8 array,
  type numeric,
  completion_step numeric,

  primary key (id)
);

alter table workflows enable row level security;

create policy "Upsert allowed for authorized users"
  on clients for select
  using (auth.uid() IS NOT NULL);

```

## Storage for Logos

```sql

-- Set up Storage!
insert into storage.buckets (id, name)
values ('logos', 'logos');

create policy "Logo images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'logos' );

create policy "Anyone can upload an logo."
  on storage.objects for insert
  with check ( bucket_id = 'logos' );

```