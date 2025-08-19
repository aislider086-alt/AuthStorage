# Database Setup for AuthStorage

## Option 1: Neon Database (Recommended - Free PostgreSQL)

1. Go to https://neon.tech/
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (it will look like: `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`)
5. Replace the DATABASE_URL in your .env file

## Option 2: Supabase (Alternative - Free PostgreSQL)

1. Go to https://supabase.com/
2. Sign up and create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Replace the DATABASE_URL in your .env file

## Option 3: Local PostgreSQL

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. Create a database named `authstorage`
3. Use connection string: `postgresql://postgres:your_password@localhost:5432/authstorage`
