-- Smart Bookmarks Database Schema
-- Run this in your Supabase SQL Editor

-- Create bookmarks table
create table if not exists public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  url text not null
);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own bookmarks" on public.bookmarks;
drop policy if exists "Users can insert own bookmarks" on public.bookmarks;
drop policy if exists "Users can delete own bookmarks" on public.bookmarks;
drop policy if exists "Users can update own bookmarks" on public.bookmarks;

-- Create RLS policies
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id);

-- Enable Realtime for bookmarks table
alter publication supabase_realtime add table public.bookmarks;

-- Create index for faster queries
create index if not exists idx_bookmarks_user_id on public.bookmarks(user_id);
create index if not exists idx_bookmarks_created_at on public.bookmarks(created_at desc);
