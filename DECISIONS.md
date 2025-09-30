# Key Decisions & Assumptions

This document outlines the key decisions made during development and the assumptions that guided them.

## 🎯 Core Decisions

### 1. Technology Stack

#### Next.js 14 (App Router)
**Decision**: Use Next.js 14 with the App Router instead of Pages Router or other frameworks.

**Why**:
- App Router provides better performance with Server Components
- Built-in API routes perfect for secure LLM integration
- Excellent TypeScript support
- Industry standard for React applications
- Easy deployment to Vercel
- Future-proof architecture

**Trade-offs**:
- Slightly steeper learning curve than Pages Router
- Some libraries not yet fully compatible with App Router
- More opinionated structure

---

#### Supabase for Database
**Decision**: Use Supabase instead of other database solutions.

**Why**:
- PostgreSQL with modern developer experience
- Built-in Row Level Security (RLS) for data protection
- Real-time capabilities for future features
- Array data type perfect for storing interests
- Easy to set up and migrate
- Free tier suitable for demo/MVP

**Trade-offs**:
- Requires external service (not self-hosted by default)
- Free tier has limitations
- Adds network latency

**Alternatives Considered**:
- MongoDB: Less structured, no built-in RLS
- Prisma + PostgreSQL: More setup complexity
- Firebase: Less SQL flexibility

---

#### shadcn/ui for Components
**Decision**: Use shadcn/ui instead of traditional component libraries.

**Why**:
- Components are copied into project (full ownership)
- Built on Radix UI (excellent accessibility)
- Highly customizable without fighting library defaults
- Tailwind CSS integration
- Modern, professional appearance
- No additional bundle size from unused components

**Trade-offs**:
- Need to copy/maintain component code
- Less comprehensive than Material-UI
- Requires Tailwind CSS

**Alternatives Considered**:
- Material-UI: Heavy bundle, harder to customize
- Chakra UI: Good but adds dependency weight
- Ant Design: Too enterprise-focused

---

#### OpenAI GPT-3.5 Turbo
**Decision**: Use OpenAI's GPT-3.5 Turbo for concept generation.

**Why**:
- Good balance of quality and cost
- JSON mode ensures structured responses
- Fast response times
- Well-documented API
- Reliable availability

**Trade-offs**:
- API costs (though minimal for demo)
- Requires API key management
- External dependency

**Alternatives Considered**:
- GPT-4: Better quality but much more expensive
- Claude: Good alternative but wanted to show OpenAI integration
- Open-source models: More complex setup, potentially lower quality

---

### 2. Database Schema Design

#### Audience Structure
**Decision**: Store audience with these specific fields:
```typescript
{
  name: string
  age_range: string
  gender: string
  location: string
  interests: string[]
  income_level: string
}
```

**Why**:
- Covers essential demographic segments
- Realistic for F500 marketing use cases
- Provides enough context for AI concept generation
- Simple enough to not overwhelm users
- Extensible for future additions

**Alternatives Considered**:
- More fields (occupation, education, etc.): Decided against to avoid complexity
- Fewer fields: Wouldn't provide enough context for quality concepts
- JSON blob for flexibility: Less structured, harder to query

---

#### Concepts Relationship
**Decision**: Link concepts to audiences with `audience_id` foreign key and support remixing with `parent_concept_id`.

**Why**:
- Clear data relationships
- Easy to query concepts by audience
- Remix lineage tracking
- Enables future features (concept trees, analytics)
- PostgreSQL foreign keys ensure data integrity

**Schema**:
```sql
concepts (
  id,
  audience_id -> audiences(id),
  parent_concept_id -> concepts(id),  -- nullable for original concepts
  title,
  description
)
```

---

### 3. User Interface Design

#### Single-Page Application
**Decision**: Build as a single-page app with side-by-side layout.

**Why**:
- All functionality visible at once
- No navigation needed
- Clear workflow: Create audience → Generate concept → View/Remix
- Mimics dashboard-style enterprise software
- Better for demo purposes

**Trade-offs**:
- Could be cluttered on mobile
- Less content separation

---

#### Gradient Background
**Decision**: Use subtle gradient background (blue to purple).

**Why**:
- Modern, professional appearance
- Aligns with creative/marketing context
- Differentiates from typical white backgrounds
- Subtle enough not to distract

---

#### Interest Tags (Multi-Select)
**Decision**: Show interests as clickable tags instead of multi-select dropdown.

**Why**:
- Better UX (see all options at once)
- Visual feedback on selection
- Common pattern in modern apps
- Easier to use on mobile

**Alternatives Considered**:
- Dropdown multi-select: More compact but worse UX
- Autocomplete: Better for large lists, overkill here

---

### 4. Feature Implementation

#### Remix Concept Feature
**Decision**: Implement remix by passing both the original concept and audience to the LLM.

**Why**:
- Creates genuinely new concepts with elements from the original
- Audience context ensures consistency
- Parent concept ID tracks lineage
- Simple implementation with high value

**Implementation**:
```typescript
// Remix passes both to AI
{
  audience: originalAudience,
  parentConcept: {
    title: "Original Title",
    description: "Original description"
  }
}
```

**Alternatives Considered**:
- Simple variation: Less creative
- Complete regeneration: Loses remix context
- Template-based: Too rigid

---

#### Real-Time Updates
**Decision**: Use simple state updates instead of Supabase real-time.

**Why**:
- Single-user assumption for MVP
- Simpler implementation
- No WebSocket overhead
- Easy to add later if multi-user needed

---

### 5. Security Decisions

#### Row Level Security (RLS)
**Decision**: Enable RLS but allow all operations for now.

**Why**:
- Demonstrates security awareness
- Easy to restrict later with authentication
- Database-level protection
- Best practice for Supabase

**Current Policy**:
```sql
-- Allow all operations (for demo)
CREATE POLICY "Enable all access" ON audiences
  FOR ALL USING (true);
```

**Production Recommendation**:
```sql
-- Restrict to authenticated users
CREATE POLICY "Users can only see their own" ON audiences
  FOR SELECT USING (auth.uid() = user_id);
```

---

#### API Key Protection
**Decision**: Keep OpenAI API key server-side only.

**Why**:
- Never expose API key to client
- Next.js API routes run server-side
- Prevents unauthorized usage
- Industry best practice

---

## 📋 Assumptions

### 1. User Assumptions
- **Single user**: No authentication needed for MVP
- **Trusted users**: Content moderation not implemented
- **Technical literacy**: Users understand basic marketing concepts
- **English language**: All interfaces and content in English

### 2. Technical Assumptions
- **Modern browsers**: Chrome, Firefox, Safari, Edge (evergreen)
- **Stable internet**: Required for AI generation
- **JavaScript enabled**: SPA requires JS
- **Screen size**: Optimized for desktop/tablet, usable on mobile

### 3. Data Assumptions
- **Low volume**: Supabase free tier sufficient
- **Public data**: RLS allows all access for demo
- **No PII**: Audiences are general demographics, not personal data
- **English content**: AI prompts and outputs in English

### 4. Business Assumptions
- **Cost acceptable**: OpenAI API costs within reason for demo
- **Response time**: Users accept 2-5 second AI generation time
- **Availability**: Acceptable to depend on third-party services
- **Scalability**: Not optimized for thousands of concurrent users

### 5. Scope Assumptions
- **No analytics**: Usage tracking not implemented
- **No collaboration**: Single-user workflow
- **No export**: Concepts viewable only in app
- **No versioning**: Concepts immutable after creation (except remix)

---

## 🔄 What I'd Do Differently for Production

### 1. Authentication
Add Supabase Auth with:
- Email/password login
- Social OAuth (Google, Microsoft)
- Team/organization support
- User-specific RLS policies

### 2. Testing
Implement comprehensive testing:
- Jest + React Testing Library for components
- Playwright for E2E tests
- API route testing
- Database migration tests

### 3. Error Handling
- Comprehensive error boundaries
- Retry logic for API calls
- Better error messages for users
- Error logging/monitoring (Sentry)

### 4. Performance
- React Query for data caching
- Optimistic UI updates
- Image optimization (if adding images)
- Code splitting
- CDN for static assets

### 5. Features
- Export concepts to PDF/CSV
- Concept comparison
- Analytics dashboard
- AI prompt customization
- Multiple LLM providers
- Concept versioning
- Collaboration features
- Comment/feedback system

### 6. DevOps
- CI/CD pipeline
- Automated testing
- Preview deployments
- Database backup strategy
- Monitoring and alerts
- API rate limiting

---

## 🎓 Learning & Insights

### What Went Well
1. **shadcn/ui**: Excellent DX and beautiful results
2. **Supabase**: Super easy to get started
3. **OpenAI JSON mode**: Consistent structured responses
4. **Next.js App Router**: Clean API route integration

### Challenges
1. **AI consistency**: Solved with JSON mode and clear prompts
2. **Responsive design**: Tailwind made this easier than expected
3. **Type safety**: TypeScript caught several bugs early

### What I Learned
1. **Importance of constraints**: Limited scope helped focus on quality
2. **User flow**: Single-page layout works well for this use case
3. **AI integration**: Proper prompting is crucial for good results

---

## 📚 References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: Project completion  
**Author**: [Your Name]
