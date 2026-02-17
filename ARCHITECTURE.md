# Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js Application (App Router)           │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ AuthProvider (lib/auth-context.tsx)                │ │  │
│  │  │ - Manages user session                             │ │  │
│  │  │ - Stores Google OAuth session                      │ │  │
│  │  │ - Provides auth state to all components            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                      ↑ provides ↓                        │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │         Routes                                     │ │  │
│  │  │  - app/page.tsx (Sign-in)                          │ │  │
│  │  │  - app/dashboard/page.tsx (Main app)               │ │  │
│  │  │  - app/auth/callback/page.tsx (OAuth callback)     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                      ↑ uses ↓                            │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │         Components                                 │ │  │
│  │  │  - BookmarkForm (add bookmark)                     │ │  │
│  │  │  - BookmarkList (real-time list)                   │ │  │
│  │  │  - BookmarkItem (individual bookmark + delete)     │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                      ↑ uses ↓                            │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │         Supabase Client (lib/supabase.ts)          │ │  │
│  │  │ - Authentication API calls                         │ │  │
│  │  │ - Database queries (SELECT, INSERT, DELETE)        │ │  │
│  │  │ - Real-time subscriptions (WebSocket)              │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────┬───────────────────────────────────────────────────┘
             │ HTTPS / WebSocket
             ↓
┌────────────────────────────────────────────────────────────────┐
│                  SUPABASE (Backend)                            │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Authentication Service                                │  │
│  │  - Google OAuth provider                               │  │
│  │  - Session management                                  │  │
│  │  - JWT tokens                                          │  │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Database                                   │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  users table (managed by auth)                  │ │  │
│  │  │  - id (UUID)                                    │ │  │
│  │  │  - email                                        │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  bookmarks table                                │ │  │
│  │  │  - id (UUID, PK)                                │ │  │
│  │  │  - user_id (FK → users)                         │ │  │
│  │  │  - title (TEXT)                                 │ │  │
│  │  │  - url (TEXT)                                   │ │  │
│  │  │  - created_at (TIMESTAMP)                       │ │  │
│  │  │  - updated_at (TIMESTAMP)                       │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │          with Row Level Security (RLS) policies        │  │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  Real-time Engine                                      │  │
│  │  - Subscribes to table changes                         │  │
│  │  - Broadcasts INSERT, UPDATE, DELETE events            │  │
│  │  - Filters based on RLS policies                       │  │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User visits app/page.tsx                                    │
│ (Home page with "Sign in with Google" button)               │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ User clicks button → signInWithOAuth('google')              │
│ (Supabase SDK)                                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓ (redirect to Google)
┌─────────────────────────────────────────────────────────────┐
│ Google OAuth popup                                          │
│ User grants permission                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓ (redirect back to app)
┌─────────────────────────────────────────────────────────────┐
│ app/auth/callback/page.tsx                                  │
│ - Handles OAuth callback with auth token                    │
│ - Creates session                                           │
│ - Redirects to /dashboard                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ app/dashboard/page.tsx                                      │
│ - useAuth() gets user from context                          │
│ - Shows authenticated dashboard                            │
│ - User can add/delete bookmarks                             │
└─────────────────────────────────────────────────────────────┘
```

## Add Bookmark Flow

```
┌──────────────────────────────────────┐
│ User enters title & URL in form       │
│ Clicks "Add Bookmark"                 │
└────────────┬─────────────────────────┘
             │
             ↓
┌──────────────────────────────────────┐
│ BookmarkForm validates input          │
│ - Title not empty                    │
│ - URL is valid format                │
└────────────┬─────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────────┐
│ Call: supabase.from('bookmarks').insert([{                  │
│   title,                                                    │
│   url,                                                      │
│   user_id: user.id  ← Automatically filtered by Supabase   │
│ }])                                                         │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────────┐
│ Supabase RLS Policy Check:                                  │
│ INSERT is allowed IF auth.uid() = user_id (current user)   │
│                                                             │
│ ✓ User owns the session → INSERT allowed                   │
│ ✗ Different user → INSERT denied (even via ANON_KEY)       │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────────┐
│ Row inserted into bookmarks table                           │
│                                                             │
│ id: <new UUID>                                              │
│ title: "GitHub"                                             │
│ url: "https://github.com"                                   │
│ user_id: <logged-in user's ID>                              │
│ created_at: <current timestamp>                             │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────────┐
│ Realtime Event: INSERT (broadcast to subscribers)           │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────────────────────────┐
│ BookmarkList subscription receives event                     │
│ (if event.user_id = current user's ID)                     │
│                                                             │
│ - Add new bookmark to state                                │
│ - Component re-renders                                      │
│ - User sees new bookmark appear                             │
└──────────────────────────────────────────────────────────────┘
```

## Real-time Sync Across Tabs

```
┌────────────────────────┐              ┌────────────────────────┐
│   BROWSER TAB 1        │              │   BROWSER TAB 2        │
│                        │              │                        │
│  BookmarkList:         │              │  BookmarkList:         │
│  - Subscribed to       │              │  - Subscribed to       │
│    postgres_changes    │              │    postgres_changes    │
│    for current user    │              │    for current user    │
│                        │              │                        │
│  Bookmarks: [A, B, C]  │              │  Bookmarks: [A, B, C]  │
└────────────┬───────────┘              └────────────┬───────────┘
             │                                       │
             │ User adds bookmark "D"               │
             │ in Tab 1                             │
             │                                       │
             └──────────────┬──────────────────────┘
                            │
                            ↓
        ┌───────────────────────────────────────┐
        │ Supabase PostgreSQL                   │
        │                                       │
        │ INSERT into bookmarks (title, url...) │
        │                                       │
        │ Realtime engine broadcasts event      │
        └───────────────────┬───────────────────┘
                            │
             ┌──────────────┴──────────────┐
             ↓                             ↓
┌────────────────────────┐    ┌────────────────────────┐
│   BROWSER TAB 1        │    │   BROWSER TAB 2        │
│                        │    │                        │
│  Receives INSERT event │    │  Receives INSERT event │
│  for bookmark "D"      │    │  for bookmark "D"      │
│  (from subscription)   │    │  (from subscription)   │
│                        │    │                        │
│  Updates state:        │    │  Updates state:        │
│  Bookmarks: [D,A,B,C]  │    │  Bookmarks: [D,A,B,C]  │
│                        │    │                        │
│  Component re-renders  │    │  Component re-renders  │
│  User sees "D" added   │    │  User sees "D" added   │
│  (instant, no refresh) │    │  (instant, no refresh) │
└────────────────────────┘    └────────────────────────┘
```

## RLS Policy Protection

```
┌────────────────────────────────────────────────────────┐
│ User A (id: 111) clicks "Add Bookmark"                │
│                                                        │
│ INSERT into bookmarks (title, url, user_id)           │
│ VALUES ('My Site', 'https://site.com', 111)           │
│                                                        │
│ RLS Check: INSERT allowed IF auth.uid() = user_id     │
│            auth.uid() = 111 = 111 ✓ ALLOWED           │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ Attacker tries to insert with different user_id        │
│ (Even with ANON_KEY, because RLS is enforced)         │
│                                                        │
│ INSERT into bookmarks (title, url, user_id)           │
│ VALUES ('Hacked', 'https://evil.com', 222)            │
│                                                        │
│ RLS Check: INSERT allowed IF auth.uid() = user_id     │
│            auth.uid() = 111 ≠ 222 ✗ DENIED            │
│                                                        │
│ → Database returns error                              │
│ → Attacker cannot insert bookmarks for other users    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ User B (id: 222) tries to view User A's bookmarks      │
│                                                        │
│ SELECT * FROM bookmarks WHERE user_id = 111           │
│                                                        │
│ RLS Check: SELECT allowed IF auth.uid() = user_id     │
│            auth.uid() = 222 ≠ 111 ✗ DENIED            │
│                                                        │
│ → Database returns 0 rows                             │
│ → User B only sees their own bookmarks                │
└────────────────────────────────────────────────────────┘
```

## Database Schema

```sql
┌─────────────────────────────────────────────────────┐
│              bookmarks Table                        │
├─────────────────────────────────────────────────────┤
│ id          │ UUID          │ PK                    │
│ created_at  │ TIMESTAMP     │ Default: now()        │
│ updated_at  │ TIMESTAMP     │ Default: now()        │
│ user_id     │ UUID (FK)     │ References users(id)  │
│ title       │ TEXT          │ NOT NULL              │
│ url         │ TEXT          │ NOT NULL              │
├─────────────────────────────────────────────────────┤
│ Indexes:                                            │
│ - idx_bookmarks_user_id (for fast filtering)        │
│ - idx_bookmarks_created_at (for sorting)            │
├─────────────────────────────────────────────────────┤
│ RLS Policies:                                       │
│ - SELECT: auth.uid() = user_id                      │
│ - INSERT: auth.uid() = user_id                      │
│ - UPDATE: auth.uid() = user_id                      │
│ - DELETE: auth.uid() = user_id                      │
└─────────────────────────────────────────────────────┘
```

## Component Dependencies

```
app/layout.tsx
  └─ AuthProvider (lib/auth-context.tsx)
      ├─ Supabase client (lib/supabase.ts)
      └─ useAuth() hook
           ↑ provided to all children

app/page.tsx
  ├─ useAuth()
  │  └─ user, loading, signInWithGoogle
  └─ useRouter()

app/dashboard/page.tsx
  ├─ useAuth()
  │  └─ user, loading, signOut
  ├─ useRouter()
  └─ Components:
      ├─ BookmarkForm
      │  ├─ useAuth() → user
      │  └─ supabase.from('bookmarks').insert()
      │
      └─ BookmarkList
         ├─ useAuth() → user
         ├─ supabase.from('bookmarks').select()
         ├─ supabase.channel() → subscribe realtime
         │
         └─ BookmarkItem (rendered for each bookmark)
            ├─ supabase.from('bookmarks').delete()
            └─ Button to trigger delete
```
