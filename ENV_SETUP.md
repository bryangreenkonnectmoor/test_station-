# 🔧 Environment Variables Setup

## ⚠️ Required Before Running

You need to create a `.env.local` file with your API credentials.

---

## Quick Setup (3 steps)

### 1. Create the file

Create a new file named `.env.local` in the project root (same folder as `package.json`)

### 2. Add these variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
OPENAI_API_KEY=your_actual_key_here
```

### 3. Get your credentials

**Supabase (Free Tier):**
1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Wait 2 minutes for setup
4. Go to Settings (⚙️) → API
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**OpenAI (Requires Billing):**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / log in
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy key → `OPENAI_API_KEY`
6. **Important**: Add payment method in Billing section

---

## Example `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-abc123def456...
```

---

## After Creating `.env.local`

1. **Restart the dev server:**
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **The errors will be gone!** ✅

3. **Open browser:** http://localhost:3000

---

## Database Setup (Also Required)

After creating `.env.local`, you need to set up the database:

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy contents from `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste and click "Run"
5. You should see "Success. No rows returned"

---

## Verification

Once setup is complete, you should be able to:
- ✅ Load the app without errors
- ✅ Create an audience
- ✅ Generate a concept
- ✅ Remix a concept

---

## Need Help?

**Quick Guide**: [QUICKSTART.md](./QUICKSTART.md)  
**Detailed Setup**: [INSTALLATION.md](./INSTALLATION.md)  
**Troubleshooting**: [INSTALLATION.md#troubleshooting](./INSTALLATION.md)

---

## Common Issues

**"supabaseUrl is required"**
→ You haven't created `.env.local` yet

**"401 Unauthorized" (OpenAI)**
→ Check your OpenAI API key is correct

**"Insufficient credits" (OpenAI)**
→ Add billing in OpenAI dashboard

**App loads but can't create audience**
→ Run the database migration in Supabase SQL Editor
