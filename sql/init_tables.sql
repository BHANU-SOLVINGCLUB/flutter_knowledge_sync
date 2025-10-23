-- Run this once in your Supabase SQL editor to create minimal tables.

create table if not exists flutter_docs (
  id text primary key,
  title text,
  url text,
  summary text,
  content text,
  updated_at timestamptz default now()
);

create table if not exists pub_packages (
  id text primary key,
  name text,
  description text,
  raw jsonb,
  updated_at timestamptz default now()
);

create table if not exists github_issues (
  id text primary key,
  title text,
  issue_number int,
  labels text[],
  body text,
  url text,
  created_at timestamptz
);
