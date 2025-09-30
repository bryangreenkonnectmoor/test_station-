# Quick Start Guide

Get the Audience Concept Generator running locally in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free)
- OpenAI API key

## Setup Steps

### 1. Install Dependencies (1 minute)

```bash
npm install
```

### 2. Set Up Supabase (3 minutes)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration from `supabase/migrations/20250930000000_initial_schema.sql`
3. Go to Settings → API and copy:
   - Project URL
   - `anon public` key

### 3. Get OpenAI API Key (2 minutes)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key under "API Keys"
3. Add a payment method (required for API access)

### 4. Configure Environment Variables (1 minute)

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 5. Run the Application (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the Application

### Create Your First Audience

1. Fill in the "Create Audience" form:
   - **Name**: "Tech-Savvy Millennials"
   - **Age Range**: "25-34"
   - **Gender**: "All"
   - **Location**: "Urban Northeast, USA"
   - **Interests**: Select "Technology", "Food & Dining", "Travel"
   - **Income Level**: "Upper-Middle ($75k-$100k)"

2. Click "Create Audience"

### Generate a Concept

1. In "Generate Marketing Concept", select "Tech-Savvy Millennials"
2. Click "Generate Concept"
3. Wait 2-5 seconds for AI generation
4. See your concept appear in the list!

### Remix a Concept

1. Find your generated concept in the list
2. Click "Remix This Concept" at the bottom
3. A new variation will be generated

## What You Should See

✅ Clean, modern UI with gradient background  
✅ Audience form with all demographic fields  
✅ Concept generator with dropdown  
✅ Generated concepts displayed as cards  
✅ Toast notifications on success  
✅ Remix functionality on each concept  

## Common Issues

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Double-check `.env.local` has correct Supabase URL and key
- Ensure migration was run successfully
- Check Supabase project is active

### OpenAI API errors
- Verify API key is correct in `.env.local`
- Ensure billing is set up on OpenAI account
- Check you haven't hit spending limits

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Project Structure

```
├── app/
│   ├── api/generate-concept/  ← OpenAI integration
│   ├── page.tsx               ← Main application
│   └── layout.tsx             ← Root layout
├── components/
│   ├── AudienceForm.tsx       ← Create audiences
│   ├── ConceptGenerator.tsx   ← Generate concepts
│   └── ConceptList.tsx        ← View & remix concepts
├── lib/
│   └── supabase.ts            ← Database client
└── supabase/migrations/       ← Database schema
```

## Key Features to Test

- [x] Create audience with various demographics
- [x] Generate multiple concepts for same audience
- [x] Generate concepts for different audiences
- [x] Remix existing concepts
- [x] View audience details in concept cards
- [x] Responsive design (resize browser)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Type checking
npx tsc --noEmit
```

## Next Steps

1. **Read Documentation**:
   - `README.md` - Full project overview
   - `DECISIONS.md` - Key decisions and assumptions
   - `DEPLOYMENT.md` - Deployment guide

2. **Explore Code**:
   - Check out the clean component structure
   - See how OpenAI integration works
   - Review the database schema

3. **Customize**:
   - Modify interest options in `AudienceForm.tsx`
   - Adjust AI prompts in `app/api/generate-concept/route.ts`
   - Change colors in `tailwind.config.ts`

## Support

If you encounter any issues:

1. Check this guide's "Common Issues" section
2. Review error messages in browser console
3. Check terminal output for server errors
4. Verify all environment variables are set correctly

## Tips for Reviewers

- **Time Investment**: 2-3 hours development time
- **Tech Choices**: Modern stack (Next.js 14, shadcn/ui, Supabase)
- **Code Quality**: TypeScript, clean components, good separation of concerns
- **Features**: All 3 main requirements + bonus remix feature
- **Documentation**: Comprehensive with assumptions and decisions

---

**Expected Setup Time**: ~10 minutes  
**First Concept Generation**: ~15 minutes total  

Enjoy exploring the application! 🚀
