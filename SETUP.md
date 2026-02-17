# Smart Bookmarks App - Setup Guide

## Overview
A Next.js bookmark management app with Google OAuth authentication, real-time sync, and private user bookmarks.

## Features Implemented
✓ Google OAuth authentication (sign up & login)
✓ Add bookmarks with URL + title
✓ Private bookmarks per user
✓ Real-time updates across tabs/devices using Supabase Realtime
✓ Delete bookmarks
✓ Responsive UI with Tailwind CSS

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Supabase (Auth, Database, Realtime)
- **Styling**: Tailwind CSS
- **Package**: @supabase/supabase-js

## Prerequisites
1. Node.js 18+ installed
2. Supabase account (free tier available at https://supabase.com)

## Setup Instructions

### 1. Supabase Project Setup

#### Create a new Supabase project:
1. Go to https://app.supabase.com
2. Create a new project
3. Note your `Project URL` and `Anon Key` from Settings > API

#### Configure Google OAuth:
1. Go to Authentication > Providers
2. Enable Google
3. Add your Google OAuth credentials:
   - Get credentials from https://console.cloud.google.com
   - In Google Cloud Console: Create OAuth 2.0 ID
   - Authorized redirect URIs should include:
     - `https://YOUR-PROJECT.supabase.co/auth/v1/callback`

#### Create Database Schema:
Run this SQL in the Supabase SQL Editor:

```sql
-- Enable RLS
alter role postgres set pgrst.jwt_secret to 'your-super-secret-jwt-token-with-at-least-32-characters-long';

-- Create bookmarks table
create table public.bookmarks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid not null references auth.users on delete cascade,
  title text not null,
  url text not null
);

-- Enable RLS
alter table public.bookmarks enable row level security;

-- Create policies
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

-- Enable Realtime
alter publication supabase_realtime add table public.bookmarks;
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Replace with your actual Supabase credentials.

### 3. Install and Run

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
app/
  page.tsx                 # Home/sign-in page
  dashboard/
    page.tsx              # Main app (protected route)
  auth/
    callback/
      page.tsx            # OAuth callback handler
  layout.tsx              # Root layout with AuthProvider
  globals.css             # Global styles

lib/
  supabase.ts             # Supabase client initialization
  auth-context.tsx        # Auth context & provider

components/
  BookmarkForm.tsx        # Add bookmark form
  BookmarkItem.tsx        # Individual bookmark item
  BookmarkList.tsx        # Bookmark list with real-time updates
```

## How It Works

### Authentication
- User clicks "Sign in with Google" on home page
- Google OAuth redirects to Supabase auth
- Supabase creates user session
- AuthProvider manages session state globally
- Authenticated users redirected to dashboard

### Real-Time Bookmarks
- BookmarkList subscribes to Supabase Realtime channel
- When bookmark is added/deleted in one tab, all tabs update immediately
- Uses RLS (Row Level Security) to ensure users only see their bookmarks
- Only the authenticated user's bookmarks are filtered (user_id = auth.uid())

### Privacy
- Database policies enforce that users can only access/modify their own bookmarks
- All queries filtered by user_id
- RLS prevents unauthorized data access

## Testing

### Test Sign-In:
1. Click "Sign in with Google"
2. Complete Google OAuth flow
3. Should redirect to dashboard

### Test Bookmarks:
1. Add a bookmark with title and URL
2. Bookmark should appear in list immediately
3. Open same app in another tab
4. Add bookmark in first tab - should appear in second tab without refresh

### Test Delete:
1. Click delete button on any bookmark
2. Confirm deletion
3. Bookmark should disappear from all tabs

## Deployment

### To Vercel:
```bash
# Push to GitHub, then:
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Add environment variables in Vercel project settings
# 4. Deploy
```

Add in Vercel Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Also update Google OAuth redirect URIs:
- Add your Vercel deployment URL: `https://your-app.vercel.app/auth/callback`

## Troubleshooting

### "Failed to sign in"
- Check Google OAuth credentials in Supabase
- Verify redirect URI includes your app URL

### Bookmarks not syncing in real-time
- Check Realtime is enabled on bookmarks table
- Verify RLS policies are set correctly
- Check browser console for errors

### "Unauthorized" errors
- Ensure RLS policies are in place
- Verify user is authenticated
- Check user_id matches in bookmarks table

### Development issues
- Clear `.next` folder: `rm -rf .next`
- Clear browser cache
- Check `npm run dev` output for errors
