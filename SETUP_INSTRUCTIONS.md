# 🚨 Setup Required

## You're seeing errors because environment variables are not configured yet!

### Quick Fix (2 minutes)

1. **Create `.env.local` file** in the root directory (next to `package.json`)

2. **Add these three variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=sk-your-openai-api-key
```

3. **Get your credentials:**

**Supabase** (free):
- Go to [supabase.com](https://supabase.com)
- Create a new project (takes 2 minutes)
- Go to Settings → API
- Copy "Project URL" and "anon public" key

**OpenAI** (requires billing):
- Go to [platform.openai.com](https://platform.openai.com)
- Create API key under "API Keys"
- Add a payment method in "Billing"

4. **Restart the dev server:**
```bash
# Press Ctrl+C to stop current server
npm run dev
```

### Alternative: Use Template

```bash
# Copy the template
cp .env.local.template .env.local

# Edit .env.local with your actual values
```

---

## Full Setup Guide

For complete setup instructions, see:
- **[QUICKSTART.md](./QUICKSTART.md)** - 10-minute guide
- **[INSTALLATION.md](./INSTALLATION.md)** - Detailed setup with troubleshooting

---

## Current Errors Explained

### Error 1: "useState only works in Client Components"
✅ **FIXED** - Added "use client" directive to `toaster.tsx`

### Error 2: "supabaseUrl is required"
⚠️ **NEEDS SETUP** - Create `.env.local` with Supabase credentials

Once you create `.env.local` with the correct values, the app will work perfectly!

---

## Quick Test (After Setup)

After creating `.env.local`:

1. Restart dev server: `npm run dev`
2. Open http://localhost:3000
3. You should see the app without errors!

Need help? Check [INSTALLATION.md](./INSTALLATION.md) for troubleshooting.
