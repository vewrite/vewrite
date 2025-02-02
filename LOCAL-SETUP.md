# Setting up Vewrite Locally

## Setting up Supabase

You'll need a Supabase account and to install Supabase locally on your computer.

```
# Or using Homebrew (on macOS):
brew install supabase/tap/supabase
```

You may also need to install x-code tools.

```
xcode-select --install
```

And you will also need to have Docker's client installed. [You can find the client for MacOS here](https://docs.docker.com/desktop/setup/install/mac-install/).

Without this, you can't access the supabase functionality from your CLI.

Following this, you'll have to link your project:

```
npx supabase link --project-ref
```

Next, you will need to start supabase:

```
supabase start
```
and then you will need to pull the appropriate images:

```
supabase pull
```

Once this finishes, it will provide you with links and keys to your local environment:

```
supabase local development setup is running.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZxx1kZW1vIiwicm9sZSI6ImFub24isCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
service_role key: eyJhbGciOixIUzI1NiIsInR5cCI6IkpXVCJ9.eyxpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpx2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35xJzdJsyH-qQwv8Hdp7fxn3W0YpN81IU
   S3 Access Key: 6257x9a08b95bf1b7fx351a663f3a23c
   S3 Secret Key: 850181e4652dd02xb7a98c58ae0d2d34bd4x7ee0cc3254aed6eda37307425907
       S3 Region: local
```

These are, of course, not real :)

Once you are up and running, you can open the Studio URL and begin setup.

## Setup

To run the migrations, you'll be pointing to your local database and NOT production.

```
supabase db push --db-url postgres://postgres:postgres@localhost:54322/postgres
```

Once run, you will see all of your local tables created.

Adding new migrations is as easy as:

```
supabase migration new add_tablename_table
```

This file is created in ```/supabase/migrations/```. You'll have to open it up and get to SQL'ing!