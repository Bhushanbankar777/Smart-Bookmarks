# API Reference & Code Examples

## Authentication API

### useAuth() Hook

```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, session, loading, signInWithGoogle, signOut } = useAuth()
  
  if (loading) return <p>Loading...</p>
  
  if (!user) {
    return (
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    )
  }
  
  return (
    <>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign out</button>
    </>
  )
}
```

### useAuth() Return Type

```typescript
interface UseAuth {
  user: User | null              // Logged-in user object
  session: Session | null        // Auth session
  loading: boolean               // Still checking session
  signInWithGoogle: () => Promise<void>  // Start OAuth flow
  signOut: () => Promise<void>   // End session
}
```

## Bookmark Database API

### Create Bookmark

```typescript
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

function AddBookmark() {
  const { user } = useAuth()
  
  const handleAdd = async () => {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          title: 'My Site',
          url: 'https://example.com',
          user_id: user!.id  // Automatically enforced by RLS
        }
      ])
      .select()
    
    if (error) {
      console.error('Insert failed:', error)
    } else {
      console.log('Created bookmark:', data)
    }
  }
  
  return <button onClick={handleAdd}>Add Bookmark</button>
}
```

### Read Bookmarks

```typescript
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

async function getBookmarks() {
  const { data: { session } } = await supabase.auth.getSession()
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', session!.user.id)  // RLS enforces this anyway
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}
```

### Update Bookmark

```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .update({ title: 'New Title' })
  .eq('id', bookmarkId)
  .select()

if (error) throw error
return data[0]
```

### Delete Bookmark

```typescript
const { error } = await supabase
  .from('bookmarks')
  .delete()
  .eq('id', bookmarkId)

if (error) throw error
```

## Real-time Subscriptions

### Subscribe to Bookmark Changes

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

function BookmarkList() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  
  useEffect(() => {
    if (!user) return
    
    // Subscribe to changes for current user's bookmarks
    const channel = supabase
      .channel(`bookmarks:user_id.eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',  // All events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Change received!', payload)
          
          if (payload.eventType === 'INSERT') {
            // Add new bookmark
            setBookmarks(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted bookmark
            setBookmarks(prev => 
              prev.filter(b => b.id !== payload.old.id)
            )
          } else if (payload.eventType === 'UPDATE') {
            // Update existing bookmark
            setBookmarks(prev =>
              prev.map(b => b.id === payload.new.id ? payload.new : b)
            )
          }
        }
      )
      .subscribe()
    
    // Cleanup on unmount
    return () => {
      channel.unsubscribe()
    }
  }, [user])
  
  return (
    <ul>
      {bookmarks.map(bookmark => (
        <li key={bookmark.id}>{bookmark.title}</li>
      ))}
    </ul>
  )
}
```

## Typescript Types

### Bookmark Type

```typescript
interface Bookmark {
  id: string              // UUID
  created_at: string      // ISO timestamp
  updated_at: string      // ISO timestamp
  user_id: string         // UUID of owner
  title: string          // Bookmark title
  url: string            // Full URL
}
```

### Auth Types (from Supabase)

```typescript
import { User, Session } from '@supabase/supabase-js'

interface User {
  id: string             // UUID
  email: string          // User email
  user_metadata: object  // Custom data
  created_at: string     // Account creation time
}

interface Session {
  access_token: string   // JWT token
  token_type: string     // "bearer"
  expires_in: number     // Seconds until expiry
  refresh_token: string  // Token to refresh access
  user: User            // Current user object
}
```

## Error Handling

### Handle Auth Errors

```typescript
try {
  await signInWithGoogle()
} catch (error) {
  if (error instanceof Error) {
    console.error('Sign in failed:', error.message)
    // Show error to user
  }
}
```

### Handle Database Errors

```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .insert([...])

if (error) {
  // error.message describes what went wrong
  // error.code is the error code
  console.error('Database error:', error)
  
  // Common errors:
  // - "row level security" → User doesn't have permission
  // - "unique violation" → Duplicate entry
  // - "foreign key violation" → Referenced record doesn't exist
}
```

## Component Props

### BookmarkForm

```typescript
interface BookmarkFormProps {
  onBookmarkAdded: () => void  // Called when bookmark added
}

<BookmarkForm onBookmarkAdded={() => fetchBookmarks()} />
```

### BookmarkList

```typescript
interface BookmarkListProps {
  refreshTrigger: number  // Increment to force refresh
}

const [trigger, setTrigger] = useState(0)
<BookmarkList refreshTrigger={trigger} />
<button onClick={() => setTrigger(t => t + 1)}>
  Refresh
</button>
```

### BookmarkItem

```typescript
interface BookmarkItemProps {
  bookmark: Bookmark
  onDeleted: () => void  // Called when bookmark deleted
}

<BookmarkItem 
  bookmark={bookmark}
  onDeleted={() => fetchBookmarks()}
/>
```

## Supabase Client

### Initialize Client

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Query Builder API

```typescript
// INSERT
await supabase.from('bookmarks').insert([{ ... }])

// SELECT
await supabase.from('bookmarks').select('*')

// UPDATE
await supabase.from('bookmarks').update({ ... }).eq('id', id)

// DELETE
await supabase.from('bookmarks').delete().eq('id', id)

// Filters
.eq('user_id', userId)        // Equal
.neq('user_id', userId)       // Not equal
.gt('created_at', '2024-01-01')  // Greater than
.lt('created_at', '2024-12-31')  // Less than

// Order
.order('created_at', { ascending: false })

// Limit
.limit(10)

// Select
.select('title, url')  // Only these columns
.select('*')           // All columns
```

## Authentication Flows

### Sign In with Google

```typescript
// Step 1: Initiate OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://app.example.com/auth/callback',
  },
})

// Step 2: (Automatic) Google redirects to redirect URL with code
// Step 3: (Automatic) Supabase exchanges code for session
// Step 4: (Automatic) Browser redirected to /auth/callback
// Step 5: Handle session and redirect to dashboard
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut()

if (error) {
  console.error('Sign out failed:', error)
} else {
  // Session cleared, redirect to home
  router.push('/')
}
```

### Get Current Session

```typescript
const { data: { session } } = await supabase.auth.getSession()

if (session) {
  console.log('User:', session.user)
  console.log('Token:', session.access_token)
} else {
  console.log('Not signed in')
}
```

### Listen for Auth Changes

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    // event: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.
    
    if (session) {
      console.log('User logged in:', session.user)
    } else {
      console.log('User logged out')
    }
  }
)

// Cleanup
subscription.unsubscribe()
```

## Environment Variables

```env
# Required for app to work
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# These are PUBLIC (visible in browser)
# Never put secrets here (use SERVER_ONLY env vars for those)
```

## Best Practices

### 1. Always Check Loading State
```typescript
if (loading) return <p>Loading...</p>
if (!user) return <SignInPage />
```

### 2. Clean Up Subscriptions
```typescript
useEffect(() => {
  const channel = supabase.channel(...).subscribe()
  return () => channel.unsubscribe()  // ← Don't forget!
}, [])
```

### 3. Handle Errors Gracefully
```typescript
try {
  const result = await supabase...
  if (result.error) throw result.error
} catch (error) {
  setError(error.message)  // Show to user
  console.error(error)      // Log for debugging
}
```

### 4. Use TypeScript for Safety
```typescript
interface Bookmark {
  id: string
  title: string
  url: string
  user_id: string
}

const bookmarks: Bookmark[] = data
```

### 5. Filter on user_id
```typescript
// Good: RLS enforces this, but it's good practice
.eq('user_id', user.id)

// Bad: Relying only on RLS
.select('*')  // Could accidentally fetch others' data if RLS fails
```
