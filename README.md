# Smart Bookmarks

A real-time bookmark management app with Google OAuth authentication and multi-device sync.

## Features

✅ **Google OAuth Authentication** - Sign up and login with Google (no email/password)
✅ **Add Bookmarks** - Save URLs with custom titles
✅ **Private Bookmarks** - Each user's bookmarks are private and secure
✅ **Real-time Sync** - Changes appear instantly across all your devices/tabs
✅ **Delete Bookmarks** - Easily manage your collection
✅ **Responsive Design** - Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Database**: PostgreSQL with Row Level Security

## Quick Start

### 1. Get Supabase Credentials
- Create project at https://supabase.com (free tier available)
- Get your Project URL and Anon Key from Settings > API
- Enable Google OAuth in Authentication > Providers

### 2. Setup Database
Run the SQL from `database.sql` in your Supabase SQL Editor

### 3. Configure Environment
Copy `.env.local.example` to `.env.local` and add your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 4. Install & Run
```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 📖 Documentation

- [Quick Start Guide](./QUICKSTART.md) - 5-minute setup
- [Full Setup Guide](./SETUP.md) - Detailed instructions & troubleshooting

## How It Works

### Authentication Flow
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Supabase handles authentication
4. App stores session in context
5. User redirected to dashboard

### Real-time Bookmarks
- BookmarkList subscribes to Supabase Realtime
- Database changes trigger instant updates
- Works across multiple tabs/devices
- RLS ensures users only see their data

### Security
- **Row Level Security (RLS)** enforces privacy
- Users can only access their own bookmarks
- Google OAuth handles authentication
- No passwords stored

## Project Structure

```
app/
├── page.tsx                 # Home/Sign-in
├── dashboard/page.tsx      # Main app (protected)
├── auth/callback/page.tsx  # OAuth callback
└── layout.tsx              # Root layout with AuthProvider

lib/
├── supabase.ts             # Supabase client
└── auth-context.tsx        # Auth state management

components/
├── BookmarkForm.tsx        # Add bookmark form
├── BookmarkItem.tsx        # Bookmark card
└── BookmarkList.tsx        # Real-time list

database.sql               # Database schema & RLS policies
```

## Testing Multi-Device Sync

1. Open http://localhost:3000 in two browser tabs
2. Sign in with Google in tab 1
3. Add a bookmark in tab 1
4. **See it appear in tab 2 instantly** (no refresh needed!)
5. Delete bookmark from tab 2 - disappears from tab 1

## Deployment

### To Vercel (Recommended)
1. Push code to GitHub
2. Import repo on vercel.com
3. Add environment variables
4. Deploy

Update Google OAuth redirect URIs to include your Vercel URL.

## Troubleshooting

**"Failed to sign in"**
- Verify Google OAuth credentials in Supabase
- Check redirect URI matches your app URL

**Real-time not working**
- Ensure `database.sql` was executed
- Verify Realtime is enabled on bookmarks table
- Check browser console for errors

**See [SETUP.md](./SETUP.md) for more help**

## License

MIT

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Live URL Vercel

https://smart-bookmarks-brown.vercel.app