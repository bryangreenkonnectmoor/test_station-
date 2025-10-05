# Audience Concept Generator

An AI-powered marketing concept generator built for Station Sciences' technical interview project.

## 🚀 Live Demo

[Deployed Application URL will be here after deployment]

## 📋 Overview

This application allows marketing professionals to:
1. **Create detailed audience profiles** with demographic variables
2. **Generate AI-powered marketing concepts** tailored to specific audiences
3. **Save and view all generated concepts** in Supabase
4. **Remix existing concepts** to create variations with elements from previous ideas

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **AI**: OpenAI GPT-4o (latest GPT-4 Optimized model)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd audience-concept-generator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Set up Supabase**:

- Create a new Supabase project at [supabase.com](https://supabase.com)
- Run the migration file located at `supabase/migrations/20250930000000_initial_schema.sql` in your Supabase SQL editor
- This will create the necessary tables (`audiences` and `concepts`) with proper RLS policies

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

### Audiences Table
```sql
- id: UUID (Primary Key)
- name: TEXT
- age_range: TEXT
- gender: TEXT
- location: TEXT
- interests: TEXT[]
- income_level: TEXT
- created_at: TIMESTAMPTZ
```

### Concepts Table
```sql
- id: UUID (Primary Key)
- audience_id: UUID (Foreign Key → audiences)
- title: TEXT
- description: TEXT
- parent_concept_id: UUID (Foreign Key → concepts, nullable)
- created_at: TIMESTAMPTZ
```

## 📐 Architecture & Key Decisions

### 1. **Framework Choice: Next.js 14 with App Router**
**Decision**: Used Next.js 14 with the App Router instead of Pages Router.

**Rationale**: 
- Modern approach with better performance through Server Components
- API routes integrated cleanly for the LLM endpoint
- Better TypeScript integration
- Aligns with current industry best practices

### 2. **Database: Supabase**
**Decision**: Used Supabase PostgreSQL with Row Level Security (RLS).

**Rationale**:
- Real-time capabilities for future features
- Built-in authentication ready for multi-user expansion
- PostgreSQL's array type perfect for storing interests
- RLS policies ensure data security at the database level
- Easy migration path for production

### 3. **UI Library: shadcn/ui**
**Decision**: Used shadcn/ui components instead of a traditional component library.

**Rationale**:
- Components are owned and customizable (not npm dependencies)
- Built on Radix UI primitives (accessible by default)
- Tailwind CSS integration matches modern design practices
- Professional appearance without heavy dependencies
- Easy to modify for brand-specific styling

### 4. **LLM Integration: OpenAI API**
**Decision**: Direct OpenAI API integration via Next.js API route.

**Rationale**:
- Keeps API key secure on the server
- GPT-4o provides superior creative quality for marketing concepts
- Latest GPT-4 Optimized model with better audience understanding
- JSON mode ensures consistent response structure
- Fast response times with improved capabilities
- Easy to swap for other LLM providers if needed

### 5. **State Management: React Hooks**
**Decision**: Used local React state instead of global state management.

**Rationale**:
- Application scope is small and focused
- Data primarily flows from database to UI
- Adding Redux/Zustand would be over-engineering
- Easier to understand and maintain for the project scope

### 6. **Audience Variables**
**Decision**: Selected these demographic variables:
- Age Range
- Gender
- Location
- Interests (multi-select)
- Income Level

**Rationale**:
- Represents core marketing segmentation variables
- Provides enough context for meaningful AI concept generation
- Realistic for F500 marketing use cases
- Balance between simplicity and usefulness

### 7. **Remix Feature Implementation**
**Decision**: Store parent concept ID to track remix lineage.

**Rationale**:
- Enables showing remix history
- Allows future features like "concept trees"
- Simple implementation that provides value
- Passes both concepts to LLM for better remixing

## 🎨 Design Decisions

### User Experience
- **Clean, modern interface** focusing on ease of use
- **Gradient background** for visual appeal without distraction
- **Clear visual hierarchy** with cards and proper spacing
- **Responsive design** works on mobile, tablet, and desktop
- **Loading states** for all async operations
- **Toast notifications** for user feedback
- **Disabled states** prevent invalid actions

### Color Scheme
- Primary blue tones for trust and professionalism
- Purple accents for creativity
- Muted backgrounds for readability
- High contrast for accessibility

## 🔐 Security Considerations

### Current Implementation
- **Row Level Security (RLS)** enabled on all tables
- **API key protection**: OpenAI key only on server
- **Environment variables** for sensitive data
- **Input validation** on forms

### Production Recommendations
- Add authentication (Supabase Auth)
- Restrict RLS policies to authenticated users
- Add rate limiting on API routes
- Implement CORS policies
- Add content moderation for AI outputs
- Sanitize user inputs
- Add API key rotation

## 📊 Future Enhancements

### Short Term
- User authentication
- Save favorite concepts
- Export concepts to PDF/CSV
- Concept versioning and comparison
- Better error handling and validation

### Long Term
- Team collaboration features
- Concept A/B testing recommendations
- Integration with marketing platforms
- Analytics dashboard
- Multiple LLM providers
- Custom prompt templates
- Brand voice customization

## 🧪 Testing Strategy

### What Should Be Tested
- **Unit tests**: Utility functions, component logic
- **Integration tests**: API routes, database operations
- **E2E tests**: User flows (create audience → generate concept → remix)
- **Accessibility tests**: WCAG compliance

### Testing Tools (Not Implemented)
- Jest + React Testing Library
- Playwright for E2E
- axe-core for accessibility

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
```

## 📝 Assumptions

1. **Single User**: Application assumes single-user operation (no authentication required for MVP)
2. **Trust Environment**: Users are trusted to create appropriate content
3. **API Costs**: OpenAI API usage is within acceptable cost limits
4. **Modern Browsers**: Targets modern evergreen browsers (Chrome, Firefox, Safari, Edge)
5. **English Language**: All content is in English
6. **Internet Connection**: Requires stable internet for AI generation
7. **Supabase Free Tier**: Database usage fits within free tier limits

## 🏗️ Project Structure

```
├── app/
│   ├── api/
│   │   └── generate-concept/
│   │       └── route.ts          # OpenAI integration endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── AudienceForm.tsx          # Create audience form
│   ├── ConceptGenerator.tsx      # Generate concepts
│   └── ConceptList.tsx           # Display & remix concepts
├── lib/
│   ├── supabase.ts               # Supabase client & types
│   └── utils.ts                  # Utility functions
├── supabase/
│   └── migrations/
│       └── 20250930000000_initial_schema.sql
└── package.json
```

## 👨‍💻 Development Notes

### Time Breakdown
- Project setup & configuration: 30 min
- Database schema & migrations: 20 min
- UI component development: 60 min
- API integration (OpenAI): 30 min
- Concept generation logic: 40 min
- Remix feature: 30 min
- Styling & polish: 30 min
- Documentation: 30 min

**Total: ~4 hours**

### Challenges Faced
1. **Ensuring consistent AI outputs**: Solved with OpenAI's JSON mode
2. **Remix feature design**: Decided to pass both audience and parent concept to LLM
3. **UI responsiveness**: Tailwind's grid system handled this well

## 📞 Contact

Built by [Your Name] for Station Sciences Technical Interview

---

**Note**: This is a demonstration project built for a technical interview. For production use, additional security, testing, and scalability measures should be implemented.
