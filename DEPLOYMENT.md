# Deployment Checklist

## Before Deploying to Production

### Supabase Setup
- [ ] Create production Supabase project
- [ ] Run `database.sql` to create schema
- [ ] Enable Google OAuth with production credentials
- [ ] Add production domain to Google OAuth redirect URIs
- [ ] Test database queries work correctly
- [ ] Verify RLS policies are in place
- [ ] Test Realtime updates work
- [ ] Set up automated backups (optional)

### Environment Variables
- [ ] Create `.env.local` with production Supabase credentials
- [ ] Do NOT commit `.env.local` to git
- [ ] Add to `.gitignore` (already done)
- [ ] Variables are `NEXT_PUBLIC_*` for client-side access

### Code Review
- [ ] All TypeScript types are correct
- [ ] No console.log statements in production code
- [ ] Error handling is complete
- [ ] Loading states work properly
- [ ] Responsive design tested on mobile

### Testing
- [ ] Test sign in with Google
- [ ] Test add bookmark
- [ ] Test delete bookmark
- [ ] Test real-time sync (two tabs)
- [ ] Test across different browsers
- [ ] Test on mobile device
- [ ] Test slow network (Chrome DevTools)

### Vercel Deployment
- [ ] Code pushed to GitHub
- [ ] Import project on vercel.com
- [ ] Add environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deploy

### Post-Deployment
- [ ] Test app on production URL
- [ ] Test sign in flow
- [ ] Test add/delete bookmarks
- [ ] Test real-time sync
- [ ] Update Google OAuth redirect URIs if needed
- [ ] Monitor error logs
- [ ] Set up uptime monitoring (optional)

## Environment Variables for Deployment

### Vercel Project Settings > Environment Variables

Add these for production:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
```

Both variables should be available in:
- Development
- Preview
- Production

## Google OAuth Configuration

### Update Redirect URIs
Add your production URL to Google OAuth:
- `https://your-domain.com/auth/callback`
- `https://your-app.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback` (for local development)

## Security Checklist

- [ ] HTTPS enabled (Vercel provides this)
- [ ] RLS policies enforced on database
- [ ] No secrets in code/git
- [ ] CORS properly configured (Supabase handles this)
- [ ] Auth tokens handled securely
- [ ] User input validated
- [ ] Database backups enabled

## Monitoring

After deployment, monitor:
- [ ] Error logs in Vercel
- [ ] Database usage in Supabase
- [ ] Auth attempts
- [ ] Real-time connections
- [ ] API response times

## Scaling

If app grows:
- [ ] Monitor Supabase quota
- [ ] Consider Supabase Pro plan if needed
- [ ] Monitor Vercel usage
- [ ] Set up analytics
- [ ] Consider caching strategies
