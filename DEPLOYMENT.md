# Deployment Guide

This guide walks you through deploying the Audience Concept Generator to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- OpenAI API key

## Step-by-Step Deployment

### 1. Set Up Supabase

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details (name, database password, region)
   - Wait for project to be created (~2 minutes)

2. **Run Database Migration**:
   - In your Supabase project dashboard, go to "SQL Editor"
   - Click "New Query"
   - Copy the contents of `supabase/migrations/20250930000000_initial_schema.sql`
   - Paste and click "Run"
   - Verify tables were created in "Table Editor"

3. **Get API Credentials**:
   - Go to "Project Settings" → "API"
   - Copy `Project URL` (looks like `https://xxxxx.supabase.co`)
   - Copy `anon public` key (under "Project API keys")
   - Save these for later

### 2. Get OpenAI API Key

1. **Create OpenAI Account**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or log in

2. **Create API Key**:
   - Go to "API Keys" in your account settings
   - Click "Create new secret key"
   - Name it (e.g., "Audience Concept Generator")
   - Copy the key (you won't see it again!)
   - Save for later

3. **Add Billing** (required for API access):
   - Go to "Billing" → "Payment methods"
   - Add a payment method
   - Set a spending limit (recommended: $5-10 for testing)

### 3. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/audience-concept-generator.git
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**:
   - In "Configure Project" section, expand "Environment Variables"
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
     OPENAI_API_KEY = your_openai_api_key
     ```
   - Click "Deploy"

4. **Wait for Deployment**:
   - Vercel will build and deploy (~2-3 minutes)
   - You'll get a production URL (e.g., `https://your-project.vercel.app`)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add OPENAI_API_KEY
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### 4. Verify Deployment

1. **Visit Your Site**:
   - Go to your Vercel deployment URL
   - You should see the Audience Concept Generator

2. **Test Core Features**:
   - Create an audience
   - Generate a concept
   - Remix a concept
   - Check for any errors in browser console

3. **Check Supabase**:
   - Go to Supabase "Table Editor"
   - Verify data appears in `audiences` and `concepts` tables

### 5. Domain Setup (Optional)

1. **Add Custom Domain**:
   - In Vercel project settings, go to "Domains"
   - Click "Add"
   - Enter your domain (e.g., `concepts.yoursite.com`)
   - Follow DNS configuration instructions

## Environment Variables Reference

```bash
# Supabase (both are safe to expose to client)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (keep secret - only on server)
OPENAI_API_KEY=sk-proj-xxxxx...
```

## Troubleshooting

### Build Failures

**Error**: `Module not found`
- **Solution**: Run `npm install` locally to verify all dependencies
- Check `package.json` for missing packages

**Error**: `Type errors`
- **Solution**: Run `npm run build` locally to catch TypeScript errors
- Fix any type errors before deploying

### Runtime Errors

**Error**: `Failed to fetch` or network errors
- **Solution**: Check environment variables are set correctly
- Verify Supabase URL and keys in Vercel dashboard

**Error**: `OpenAI API error`
- **Solution**: 
  - Verify API key is correct
  - Check billing is set up on OpenAI account
  - Ensure spending limits aren't exceeded

**Error**: Database connection issues
- **Solution**:
  - Check Supabase project is running
  - Verify RLS policies allow operations
  - Check network connectivity

### Performance Issues

**Slow concept generation**
- **Cause**: OpenAI API can take 2-5 seconds
- **Solution**: This is normal, consider adding progress indicators

**Database queries slow**
- **Solution**: 
  - Check indexes are created (they should be from migration)
  - Consider pagination for large datasets

## Monitoring & Maintenance

### 1. Monitor OpenAI Costs

- Check [OpenAI usage dashboard](https://platform.openai.com/usage)
- Set up billing alerts
- Monitor daily/monthly spend

### 2. Monitor Vercel

- Check "Analytics" tab in Vercel dashboard
- Monitor function execution times
- Check for errors in "Logs"

### 3. Monitor Supabase

- Check database size (free tier: 500MB)
- Monitor API requests (free tier: 50,000/day)
- Review "Database" → "Usage" in Supabase dashboard

### 4. Backups

**Supabase Database**:
- Free tier: Daily backups (7 days retention)
- Export important data periodically:
  ```sql
  -- In Supabase SQL Editor
  COPY (SELECT * FROM audiences) TO STDOUT WITH CSV HEADER;
  COPY (SELECT * FROM concepts) TO STDOUT WITH CSV HEADER;
  ```

## Scaling Considerations

### When You Outgrow Free Tier

**Supabase** (Free tier limits):
- Database size: 500MB
- Bandwidth: 5GB
- API requests: 500,000/month

**Upgrade**: Pro plan at $25/month

**Vercel** (Free tier limits):
- 100GB bandwidth/month
- Unlimited serverless function executions

**Upgrade**: Pro plan at $20/month

**OpenAI**:
- Pay-as-you-go pricing
- GPT-3.5 Turbo: ~$0.002 per concept
- Consider GPT-4 for better quality: ~$0.03 per concept

## Security Hardening for Production

1. **Add Authentication**:
   ```typescript
   // Enable Supabase Auth
   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
   ```

2. **Update RLS Policies**:
   ```sql
   -- Restrict to authenticated users
   DROP POLICY "Enable all access" ON audiences;
   
   CREATE POLICY "Users can manage own audiences"
     ON audiences FOR ALL
     USING (auth.uid() = user_id);
   ```

3. **Add Rate Limiting**:
   - Use Vercel Edge Config or Upstash Redis
   - Limit concept generation to prevent abuse

4. **Content Moderation**:
   - Add OpenAI moderation endpoint
   - Filter inappropriate content

## Continuous Deployment

Once set up with GitHub + Vercel:

1. **Automatic Deployments**:
   - Push to `main` branch → automatic production deploy
   - Push to other branches → preview deployments

2. **Preview Deployments**:
   - Each PR gets unique preview URL
   - Test changes before merging

3. **Rollbacks**:
   - In Vercel dashboard, go to "Deployments"
   - Click "..." on any previous deployment
   - Click "Promote to Production"

## Support Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production build locally
npm run start

# Deploy to Vercel
vercel --prod

# Check environment variables
vercel env ls
```

---

**Estimated Total Deployment Time**: 15-20 minutes  
**Estimated Monthly Cost** (low usage): $0-5  
**Recommended Testing Time**: 30 minutes

Good luck with your deployment! 🚀
