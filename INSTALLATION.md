# Installation & Setup Guide

Complete guide to get the Audience Concept Generator running locally.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)
- A **code editor** (VS Code recommended)

## 🚀 Quick Install (5 Steps)

### Step 1: Get the Code

If you have Git:
```bash
git clone <repository-url>
cd audience-concept-generator
```

Or download and extract the ZIP file.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2 minutes):
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- OpenAI SDK
- shadcn/ui components
- And more...

### Step 3: Set Up Supabase Database

1. **Create account**: Go to [supabase.com](https://supabase.com) and sign up
2. **Create project**: Click "New Project", fill in details
3. **Wait**: Project creation takes ~2 minutes
4. **Run migration**:
   - Open your Supabase project
   - Go to "SQL Editor" in left sidebar
   - Click "New Query"
   - Copy entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
   - Paste into editor
   - Click "Run" or press Ctrl+Enter
   - You should see "Success. No rows returned"

5. **Get credentials**:
   - Go to "Settings" (gear icon) → "API"
   - Copy **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - Copy **anon public** key (long string starting with `eyJ...`)

### Step 4: Get OpenAI API Key

1. **Create account**: Go to [platform.openai.com](https://platform.openai.com)
2. **Add payment**: Go to "Billing" and add payment method (required)
3. **Create key**: Go to "API Keys" → "Create new secret key"
4. **Copy key**: Save it immediately (you won't see it again!)

### Step 5: Configure Environment

Create a file named `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**Example** (with fake values):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl...
```

## ▶️ Run the Application

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.3
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## ✅ Verify Installation

### 1. Check the UI
You should see:
- ✅ Gradient background (blue to purple)
- ✅ "Audience Concept Generator" title with sparkle icon
- ✅ "Create Audience" form on the left
- ✅ No console errors (press F12 to check)

### 2. Test Database Connection

**Create a test audience**:
1. Fill in the form:
   - Name: "Test Audience"
   - Age Range: "25-34"
   - Gender: "All"
   - Location: "Test City"
   - Interests: Click 2-3 options
   - Income: Select any option

2. Click "Create Audience"
3. You should see a green success toast
4. "Generate Marketing Concept" section should now be available

**Verify in Supabase**:
- Go to your Supabase project
- Click "Table Editor"
- Select "audiences" table
- You should see your test audience

### 3. Test AI Integration

1. In "Generate Marketing Concept", select "Test Audience"
2. Click "Generate Concept"
3. Wait 2-5 seconds
4. You should see:
   - ✅ Loading spinner while generating
   - ✅ Success toast when complete
   - ✅ New concept card appears below
   - ✅ Concept has a title and description

**Verify in Supabase**:
- Go to "Table Editor" → "concepts"
- You should see your generated concept

### 4. Test Remix Feature

1. Find your generated concept
2. Scroll to bottom of the card
3. Click "Remix This Concept"
4. Wait 2-5 seconds
5. A new variation should appear
6. It should have a "Remixed" badge

## 🐛 Troubleshooting

### Installation Issues

**Error: `command not found: npm`**
- **Fix**: Install Node.js from [nodejs.org](https://nodejs.org/)
- Verify: Run `node --version` (should show v18 or higher)

**Error: `EACCES: permission denied`**
- **Fix** (Mac/Linux): Use `sudo npm install` or fix permissions
- **Fix** (Windows): Run terminal as Administrator

**Error: `Cannot find module`**
- **Fix**: Delete and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Database Issues

**Error: `Failed to fetch` or network errors**
- ✅ Check `.env.local` has correct Supabase URL
- ✅ Verify URL format: `https://xxxxx.supabase.co`
- ✅ No quotes around values in `.env.local`
- ✅ Restart dev server after changing `.env.local`

**Error: `relation "audiences" does not exist`**
- **Fix**: Run the migration SQL in Supabase
- Go to SQL Editor → paste migration → run

**Error: `new row violates row-level security policy`**
- **Fix**: RLS policies should be created by migration
- Verify: Table Editor → audiences → "RLS disabled" toggle should show policies

### OpenAI Issues

**Error: `401 Unauthorized`**
- ✅ Check API key is correct in `.env.local`
- ✅ Verify key starts with `sk-proj-` or `sk-`
- ✅ No extra spaces in `.env.local`
- ✅ Restart dev server

**Error: `429 Too Many Requests`**
- **Fix**: You've hit rate limits
- Wait a few minutes and try again

**Error: `Insufficient credits`**
- **Fix**: Add billing in OpenAI dashboard
- Check usage at platform.openai.com/usage

### Runtime Issues

**Browser shows "Cannot connect"**
- ✅ Verify dev server is running (check terminal)
- ✅ Check URL is `http://localhost:3000`
- ✅ Try different browser
- ✅ Clear browser cache

**Concept generation hangs**
- Wait 10 seconds (OpenAI can be slow)
- Check browser console for errors (F12)
- Check terminal for server errors
- Verify OpenAI API key is valid

**UI looks broken**
- ✅ Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- ✅ Check CSS is loading (inspect with F12)
- ✅ Try different browser

## 📁 File Structure Overview

After installation, your directory should look like:

```
audience-concept-generator/
├── node_modules/           ← Installed dependencies (created by npm install)
├── .next/                  ← Build output (created by npm run dev)
├── app/                    ← Next.js application
│   ├── api/
│   │   └── generate-concept/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             ← React components
│   ├── ui/                ← shadcn/ui components
│   ├── AudienceForm.tsx
│   ├── ConceptGenerator.tsx
│   └── ConceptList.tsx
├── lib/                    ← Utilities
│   ├── supabase.ts
│   └── utils.ts
├── supabase/              ← Database
│   └── migrations/
├── .env.local             ← Your environment variables (you create this)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Stop the server
# Press Ctrl+C in terminal
```

## 💡 Tips for Development

### Hot Reload
- Changes to code automatically reload the page
- No need to restart server for most changes
- Exception: `.env.local` changes require restart

### Browser DevTools
- Press F12 to open DevTools
- Console: See errors and logs
- Network: Monitor API calls
- Application: Check local storage

### VS Code Extensions (Recommended)
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Tailwind CSS IntelliSense**: Tailwind autocomplete
- **TypeScript**: Already built-in

## 🎓 Next Steps

Once everything is working:

1. **Explore the Code**:
   - Read `README.md` for project overview
   - Check `DECISIONS.md` for design rationale
   - Review component structure

2. **Customize**:
   - Try modifying colors in `tailwind.config.ts`
   - Add new interest options in `AudienceForm.tsx`
   - Adjust AI prompts in `app/api/generate-concept/route.ts`

3. **Deploy**:
   - Follow `DEPLOYMENT.md` for production deployment
   - Deploy to Vercel for free hosting

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Still Having Issues?

### Check These Common Mistakes

1. **`.env.local` in wrong location**
   - Should be in root directory (next to `package.json`)
   - Not in `app/` or `components/`

2. **Wrong environment variable names**
   - Must be exactly: `NEXT_PUBLIC_SUPABASE_URL`, etc.
   - Case-sensitive!

3. **Server not restarted**
   - After creating/editing `.env.local`, always restart:
   - Press Ctrl+C to stop
   - Run `npm run dev` again

4. **Browser cache**
   - Clear cache and hard refresh
   - Try incognito/private mode

### Quick Diagnostic

Run this checklist:

```bash
# 1. Verify Node version
node --version
# Should show v18 or higher

# 2. Verify npm version
npm --version
# Should show 8 or higher

# 3. Check if dependencies installed
ls node_modules
# Should show lots of folders

# 4. Check if .env.local exists
cat .env.local
# Should show your environment variables

# 5. Try building
npm run build
# Should complete without errors
```

## ✨ Success Indicators

You know everything is working when:

✅ Dev server starts without errors  
✅ Page loads at localhost:3000  
✅ No errors in browser console  
✅ Can create audiences  
✅ Can generate concepts  
✅ Can remix concepts  
✅ Data appears in Supabase  

---

**Estimated Setup Time**: 10-15 minutes  
**Difficulty**: Beginner-friendly  
**Support**: Check troubleshooting section above

Welcome aboard! 🚀
