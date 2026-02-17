# Smart Bookmarks - Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Create Supabase Project
1. Sign up at https://supabase.com (free)
2. Create new project
3. Copy your **Project URL** and **Anon Key** from Settings > API

### Step 2: Setup Google OAuth
1. In Supabase, go to Authentication > Providers
2. Enable Google
3. Create OAuth app at https://console.cloud.google.com
   - Create OAuth 2.0 ID
   - Add authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`

### Step 3: Create Database
1. In Supabase SQL Editor, run the contents of `database.sql`
   - This creates the bookmarks table with Row Level Security

### Step 4: Configure App
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Run App
```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Test It

### Open in Two Tabs
1. Open http://localhost:3000 in tab 1 and tab 2
2. Sign in with Google in tab 1
3. Add a bookmark (title: "GitHub", url: "https://github.com")
4. **See it appear instantly in tab 2 without refresh** ✨

### Delete Test
Click delete on any bookmark - it disappears from all tabs

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Home/Sign-in page |
| `app/dashboard/page.tsx` | Main app (protected) |
| `lib/auth-context.tsx` | Auth state management |
| `lib/supabase.ts` | Supabase client |
| `components/BookmarkForm.tsx` | Add bookmark form |
| `components/BookmarkList.tsx` | Real-time list with sync |
| `database.sql` | SQL schema |

## 🔐 Security Features

✓ **Google OAuth Only** - No passwords to manage
✓ **Row Level Security (RLS)** - Users only see their bookmarks
✓ **Private Database** - Enforced by Supabase policies
✓ **Real-time Sync** - Uses Supabase Realtime

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| "Sign in failed" | Check Google OAuth credentials in Supabase |
| No real-time updates | Verify `database.sql` was run, Realtime enabled |
| Bookmarks not appearing | Check RLS policies in database |
| CORS errors | Ensure redirect URL matches your domain |

## 📚 Full Documentation
See [SETUP.md](./SETUP.md) for complete setup guide and troubleshooting.
