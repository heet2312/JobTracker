# AI Job Tracker — One-Shot Claude Code Build Prompt

> Paste this entire file as your first message to Claude Code in an empty repo.
> Claude Code will generate the full production application without interruption.

---

## ABSOLUTE RULES

- Generate **working code only**. No PRDs, no architecture docs, no explanations unless inside code comments.
- Make all product, UX, and engineering decisions autonomously.
- Never stop to ask for confirmation.
- Write every file completely — no truncation, no `// ... rest of file`.
- If a file exceeds token limits, finish it in the next message automatically.
- Use TypeScript strict mode everywhere. No `any` unless truly unavoidable.
- Follow the exact folder structure defined below.

---

## PRODUCT

**Name:** AI Job Tracker  
**Tagline:** The operating system for your job search.  
**Feel:** Linear × Notion × Ashby — dark-first, minimal, keyboard-driven, AI-native.

---

## TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (React 19) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (New York style, CSS variables) |
| State | Zustand (client) + TanStack Query v5 (server state) |
| Database | MongoDB Atlas via Mongoose ODM |
| Auth | Clerk (Google OAuth + GitHub OAuth + Email) |
| AI | Google Gemini 2.5 Flash (fast ops) + Gemini 2.5 Pro (deep analysis) |
| File Storage | UploadThing (resumes, PDFs) |
| Image CDN | Cloudinary (company logos) |
| Email | Gmail API via Google OAuth |
| PDF | @react-pdf/renderer |
| Charts | Recharts |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Forms | React Hook Form + Zod |
| Deployment | Vercel (free tier optimized) |

---

## PROJECT STRUCTURE

Scaffold exactly this structure. Do not deviate.

```
ai-job-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                        # Landing page
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                      # Sidebar + topbar shell
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── board/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── jobs/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── [jobId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── loading.tsx
│   │   │   │       └── _components/
│   │   │   │           ├── job-overview-tab.tsx
│   │   │   │           ├── job-description-tab.tsx
│   │   │   │           ├── match-analysis-tab.tsx
│   │   │   │           ├── resume-versions-tab.tsx
│   │   │   │           ├── cover-letters-tab.tsx
│   │   │   │           ├── outreach-tab.tsx
│   │   │   │           ├── followups-tab.tsx
│   │   │   │           ├── interview-prep-tab.tsx
│   │   │   │           └── activity-tab.tsx
│   │   │   ├── import/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── resumes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── discover/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── activity/
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── clerk/route.ts
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts
│   │   │   │   └── [jobId]/
│   │   │   │       ├── route.ts
│   │   │   │       └── analyze/route.ts
│   │   │   ├── applications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [applicationId]/route.ts
│   │   │   ├── resumes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [resumeId]/route.ts
│   │   │   ├── ai/
│   │   │   │   ├── parse-job/route.ts
│   │   │   │   ├── match-score/route.ts
│   │   │   │   ├── optimize-resume/route.ts
│   │   │   │   ├── cover-letter/route.ts
│   │   │   │   ├── outreach/route.ts
│   │   │   │   ├── interview-prep/route.ts
│   │   │   │   ├── followup/route.ts
│   │   │   │   └── discover/route.ts
│   │   │   └── uploadthing/
│   │   │       ├── route.ts
│   │   │       └── core.ts
│   │   ├── globals.css
│   │   ├── layout.tsx                          # Root layout (ClerkProvider, QueryProvider, ThemeProvider)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   │
│   ├── components/
│   │   ├── ui/                                 # shadcn/ui primitives (auto-generated)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── topbar.tsx
│   │   │   ├── command-palette.tsx
│   │   │   └── breadcrumb.tsx
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx
│   │   │   ├── applications-chart.tsx
│   │   │   ├── funnel-chart.tsx
│   │   │   ├── match-score-trend.tsx
│   │   │   ├── recent-activity-feed.tsx
│   │   │   ├── upcoming-interviews.tsx
│   │   │   └── pending-followups.tsx
│   │   ├── board/
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   ├── kanban-card.tsx
│   │   │   └── kanban-card-skeleton.tsx
│   │   ├── jobs/
│   │   │   ├── job-card.tsx
│   │   │   ├── job-list.tsx
│   │   │   ├── job-filters.tsx
│   │   │   └── match-score-badge.tsx
│   │   ├── import/
│   │   │   ├── import-tabs.tsx
│   │   │   ├── paste-jd-form.tsx
│   │   │   ├── url-import-form.tsx
│   │   │   └── pdf-upload-form.tsx
│   │   ├── resumes/
│   │   │   ├── resume-card.tsx
│   │   │   ├── resume-editor.tsx
│   │   │   ├── resume-preview.tsx
│   │   │   └── resume-upload.tsx
│   │   ├── ai/
│   │   │   ├── ai-thinking.tsx
│   │   │   ├── match-score-ring.tsx
│   │   │   ├── skill-gap-list.tsx
│   │   │   └── score-breakdown.tsx
│   │   ├── shared/
│   │   │   ├── empty-state.tsx
│   │   │   ├── error-state.tsx
│   │   │   ├── loading-skeleton.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── copy-button.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── providers/
│   │       ├── query-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── toast-provider.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connect.ts                      # Mongoose singleton connection
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── profile.model.ts
│   │   │       ├── resume.model.ts
│   │   │       ├── resume-version.model.ts
│   │   │       ├── job.model.ts
│   │   │       ├── company.model.ts
│   │   │       ├── application.model.ts
│   │   │       ├── interview.model.ts
│   │   │       ├── interview-round.model.ts
│   │   │       ├── follow-up.model.ts
│   │   │       ├── cover-letter.model.ts
│   │   │       ├── outreach-message.model.ts
│   │   │       ├── ai-analysis.model.ts
│   │   │       ├── job-recommendation.model.ts
│   │   │       ├── activity.model.ts
│   │   │       ├── notification.model.ts
│   │   │       └── settings.model.ts
│   │   ├── ai/
│   │   │   ├── gemini.ts                       # Gemini client singleton
│   │   │   ├── prompts/
│   │   │   │   ├── job-parse.prompt.ts
│   │   │   │   ├── match-score.prompt.ts
│   │   │   │   ├── resume-optimize.prompt.ts
│   │   │   │   ├── cover-letter.prompt.ts
│   │   │   │   ├── outreach.prompt.ts
│   │   │   │   ├── interview-prep.prompt.ts
│   │   │   │   ├── followup.prompt.ts
│   │   │   │   └── job-discover.prompt.ts
│   │   │   └── services/
│   │   │       ├── job-parser.service.ts
│   │   │       ├── match-scorer.service.ts
│   │   │       ├── resume-optimizer.service.ts
│   │   │       ├── cover-letter.service.ts
│   │   │       ├── outreach.service.ts
│   │   │       ├── interview-prep.service.ts
│   │   │       ├── followup.service.ts
│   │   │       └── job-discovery.service.ts
│   │   ├── actions/
│   │   │   ├── job.actions.ts
│   │   │   ├── application.actions.ts
│   │   │   ├── resume.actions.ts
│   │   │   ├── ai.actions.ts
│   │   │   ├── activity.actions.ts
│   │   │   └── user.actions.ts
│   │   ├── validations/
│   │   │   ├── job.schema.ts
│   │   │   ├── resume.schema.ts
│   │   │   ├── application.schema.ts
│   │   │   └── profile.schema.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   ├── date.ts
│   │   │   └── pdf.ts
│   │   ├── hooks/
│   │   │   ├── use-jobs.ts
│   │   │   ├── use-applications.ts
│   │   │   ├── use-resumes.ts
│   │   │   ├── use-dashboard-stats.ts
│   │   │   ├── use-kanban.ts
│   │   │   ├── use-command-palette.ts
│   │   │   └── use-keyboard-shortcuts.ts
│   │   └── constants/
│   │       ├── kanban-stages.ts
│   │       ├── ai-models.ts
│   │       └── routes.ts
│   │
│   ├── types/
│   │   ├── job.types.ts
│   │   ├── resume.types.ts
│   │   ├── application.types.ts
│   │   ├── ai.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   └── middleware.ts                           # Clerk auth middleware
│
├── public/
│   ├── logo.svg
│   └── og.png
├── .env.local.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                             # shadcn config
└── package.json
```

---

## ENVIRONMENT VARIABLES

Generate `.env.local.example` with all required keys:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=

# MongoDB
MONGODB_URI=

# Google Gemini
GEMINI_API_KEY=
GEMINI_FLASH_MODEL=gemini-2.5-flash-preview-05-20
GEMINI_PRO_MODEL=gemini-2.5-pro-preview-05-06

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## DATABASE MODELS

Generate complete Mongoose schemas with TypeScript interfaces. Every schema must include:
- `clerkId` or `userId` foreign key where relevant
- `createdAt` / `updatedAt` timestamps
- Proper indexes
- Lean virtuals where needed

### User Model (`src/lib/db/models/user.model.ts`)
```typescript
{
  clerkId: string            // unique, indexed
  email: string              // unique, indexed
  firstName: string
  lastName: string
  imageUrl: string
  onboardingComplete: boolean
  plan: 'free' | 'pro'
  createdAt: Date
  updatedAt: Date
}
```

### Profile Model
```typescript
{
  userId: ObjectId           // ref: User, unique
  headline: string
  summary: string
  targetRoles: string[]
  targetLocations: string[]
  targetSalaryMin: number
  targetSalaryMax: number
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any'
  experienceLevel: 'intern' | 'junior' | 'mid' | 'senior' | 'staff' | 'principal' | 'executive'
  skills: string[]
  industries: string[]
  linkedinUrl: string
  githubUrl: string
  portfolioUrl: string
  activeJobSearching: boolean
}
```

### Resume Model
```typescript
{
  userId: ObjectId
  name: string               // e.g. "Full Stack", "Backend"
  isMaster: boolean
  content: string            // raw text
  fileUrl: string            // UploadThing URL
  fileKey: string
  parsedData: {
    summary: string
    experience: ExperienceItem[]
    education: EducationItem[]
    skills: string[]
    certifications: string[]
    projects: ProjectItem[]
  }
  wordCount: number
  versions: ObjectId[]       // ref: ResumeVersion
  isActive: boolean
}
```

### Job Model
```typescript
{
  userId: ObjectId
  // Raw import data
  sourceUrl: string
  rawDescription: string
  importMethod: 'url' | 'paste' | 'pdf'
  // AI-extracted data
  title: string              // indexed
  company: string            // indexed
  companyWebsite: string
  companyLogoUrl: string
  location: string
  locationType: 'remote' | 'hybrid' | 'onsite'
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  experienceRequired: string
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  keywords: string[]
  industry: string
  department: string
  seniorityLevel: string
  benefits: string[]
  techStack: string[]
  // Metadata
  applicationDeadline: Date
  postedDate: Date
  isActive: boolean
  isFavorited: boolean
  notes: string
  tags: string[]
  // Indexes: userId+title, userId+company
}
```

### Application Model
```typescript
{
  userId: ObjectId
  jobId: ObjectId            // ref: Job
  resumeVersionId: ObjectId  // ref: ResumeVersion
  stage: KanbanStage         // enum of all 13 stages
  status: 'active' | 'archived'
  appliedDate: Date
  lastActivityDate: Date
  applicationUrl: string
  portalUsername: string
  contactName: string
  contactEmail: string
  contactLinkedin: string
  salaryExpectation: number
  notes: string
  priority: 'low' | 'medium' | 'high'
  boardPosition: number      // for ordering within column
  aiAnalysisId: ObjectId
  coverLetterId: ObjectId
  stageHistory: [{
    stage: KanbanStage
    date: Date
    note: string
  }]
}
```

### AIAnalysis Model
```typescript
{
  userId: ObjectId
  jobId: ObjectId
  resumeId: ObjectId
  // Match scores (0-100)
  overallScore: number
  skillsScore: number
  experienceScore: number
  atsScore: number
  keywordScore: number
  applicationProbability: number
  // Gap analysis
  missingSkills: string[]
  missingKeywords: string[]
  matchedSkills: string[]
  matchedKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  // Detailed breakdown
  scoreBreakdown: Record<string, number>
  generatedAt: Date
  model: string
}
```

### InterviewRound Model
```typescript
{
  userId: ObjectId
  applicationId: ObjectId
  roundNumber: number
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'system-design' | 'case-study' | 'final'
  scheduledAt: Date
  duration: number           // minutes
  interviewers: string[]
  platform: string           // Zoom, Google Meet, etc.
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  // AI generated prep
  technicalQuestions: QuestionItem[]
  behavioralQuestions: QuestionItem[]
  companyQuestions: QuestionItem[]
  systemDesignTopics: string[]
  // Post-interview
  notes: string
  feedback: string
  rating: number             // 1-5 self assessment
  outcome: 'pass' | 'fail' | 'pending'
}
```

### FollowUp Model
```typescript
{
  userId: ObjectId
  applicationId: ObjectId
  type: '3-day' | '7-day' | '14-day' | 'post-interview' | 'custom'
  scheduledDate: Date
  sentDate: Date
  status: 'pending' | 'sent' | 'responded' | 'skipped'
  channel: 'email' | 'linkedin' | 'phone'
  recipient: string
  subject: string
  content: string            // AI generated
  response: string
  reminderSent: boolean
}
```

### CoverLetter Model
```typescript
{
  userId: ObjectId
  jobId: ObjectId
  applicationId: ObjectId
  resumeId: ObjectId
  tone: 'professional' | 'startup' | 'enterprise' | 'faang' | 'remote'
  content: string
  subject: string
  wordCount: number
  version: number
  isActive: boolean
  generatedAt: Date
  editedAt: Date
}
```

### OutreachMessage Model
```typescript
{
  userId: ObjectId
  jobId: ObjectId
  type: 'recruiter-email' | 'hiring-manager-email' | 'linkedin-connect' | 'linkedin-followup' | 'cold-outreach'
  recipientName: string
  recipientTitle: string
  recipientCompany: string
  subject: string
  content: string
  generatedAt: Date
  copiedAt: Date
  sentAt: Date
  status: 'draft' | 'copied' | 'sent' | 'responded'
}
```

### Activity Model
```typescript
{
  userId: ObjectId
  jobId: ObjectId
  applicationId: ObjectId
  type: ActivityType         // enum of all activity types
  title: string
  description: string
  metadata: Record<string, unknown>
  createdAt: Date
  // Index: userId+createdAt desc
}

type ActivityType =
  | 'job_imported'
  | 'analysis_generated'
  | 'resume_generated'
  | 'cover_letter_generated'
  | 'outreach_created'
  | 'application_submitted'
  | 'stage_changed'
  | 'followup_sent'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_received'
  | 'offer_accepted'
  | 'rejected'
  | 'note_added'
```

---

## KANBAN STAGES

```typescript
// src/lib/constants/kanban-stages.ts
export const KANBAN_STAGES = [
  { id: 'saved',        label: 'Saved',             color: '#71717a' },
  { id: 'interested',   label: 'Interested',         color: '#a78bfa' },
  { id: 'applied',      label: 'Applied',            color: '#60a5fa' },
  { id: 'assessment',   label: 'Assessment',         color: '#38bdf8' },
  { id: 'screening',    label: 'Screening',          color: '#34d399' },
  { id: 'interview_1',  label: 'Interview Round 1',  color: '#4ade80' },
  { id: 'interview_2',  label: 'Interview Round 2',  color: '#a3e635' },
  { id: 'final',        label: 'Final Interview',    color: '#facc15' },
  { id: 'offer',        label: 'Offer',              color: '#fb923c' },
  { id: 'accepted',     label: 'Accepted',           color: '#22c55e' },
  { id: 'rejected',     label: 'Rejected',           color: '#ef4444' },
  { id: 'ghosted',      label: 'Ghosted',            color: '#6b7280' },
  { id: 'withdrawn',    label: 'Withdrawn',          color: '#d1d5db' },
] as const
```

---

## AI SERVICES

### Gemini Client (`src/lib/ai/gemini.ts`)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const flashModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_FLASH_MODEL!,
  generationConfig: { responseMimeType: 'application/json' }
})

export const proModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_PRO_MODEL!,
  generationConfig: { responseMimeType: 'application/json' }
})

export async function generateWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  // Implement exponential backoff retry logic
}
```

### Job Parser Service

Call `flashModel`. Return structured JSON:
```typescript
interface ParsedJob {
  title: string
  company: string
  companyWebsite: string
  location: string
  locationType: 'remote' | 'hybrid' | 'onsite'
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  employmentType: string
  experienceRequired: string
  seniorityLevel: string
  department: string
  industry: string
  requiredSkills: string[]
  preferredSkills: string[]
  techStack: string[]
  responsibilities: string[]
  benefits: string[]
  keywords: string[]
  postedDate: string | null
  applicationDeadline: string | null
}
```

### Match Scorer Service

Call `proModel`. Accept job + resume text. Return:
```typescript
interface MatchScore {
  overallScore: number          // 0-100
  skillsScore: number
  experienceScore: number
  atsScore: number
  keywordScore: number
  applicationProbability: number
  matchedSkills: string[]
  missingSkills: string[]
  matchedKeywords: string[]
  missingKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  scoreBreakdown: {
    technicalSkills: number
    softSkills: number
    experienceYears: number
    industryFit: number
    locationMatch: number
    titleMatch: number
  }
}
```

### Resume Optimizer Service

Call `proModel`. Accept job + master resume. Return:
```typescript
interface OptimizedResume {
  summary: string
  experience: ResumeExperience[]
  skills: string[]
  keywords: string[]           // injected for ATS
  changes: string[]            // list of what was changed and why
  atsScore: number
  wordCount: number
  fullText: string             // ready-to-render
}
```

### Cover Letter Service

Call `proModel`. Return:
```typescript
interface GeneratedCoverLetter {
  subject: string
  content: string              // 3-4 paragraphs, tone-matched
  wordCount: number
  tone: string
  highlights: string[]         // key selling points used
}
```

### Outreach Service

Call `flashModel`. Generate all 5 types in one call. Return:
```typescript
interface OutreachMessages {
  recruiterEmail: { subject: string; body: string }
  hiringManagerEmail: { subject: string; body: string }
  linkedinConnect: { message: string }
  linkedinFollowup: { message: string }
  coldOutreach: { subject: string; body: string }
}
```

### Interview Prep Service

Call `proModel`. Return:
```typescript
interface InterviewPrep {
  technicalQuestions: Question[]
  behavioralQuestions: Question[]
  companyQuestions: Question[]
  systemDesignTopics: string[]
  readinessScore: number
  prepPlan: string[]
}

interface Question {
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  sampleAnswer: string
}
```

### Follow-Up Service

Call `flashModel`. Return:
```typescript
interface FollowUpMessage {
  subject: string
  content: string
  type: string
  bestSendTime: string
}
```

### Job Discovery Service

Call `proModel` with user profile. Return:
```typescript
interface JobRecommendation {
  title: string
  company: string
  location: string
  estimatedSalary: string
  matchScore: number
  matchReason: string
  missingSkills: string[]
  priorityScore: number
  whyApply: string
  searchQuery: string          // what to search on LinkedIn/Indeed
}
```

---

## PAGES — COMPLETE IMPLEMENTATION

### Root Layout (`src/app/layout.tsx`)
- `ClerkProvider` wrapping everything
- `ThemeProvider` (next-themes, dark default)
- `QueryProvider` (TanStack Query)
- `Toaster` (sonner)
- Inter font
- Proper metadata (title template, description, og:image)

### Landing Page (`src/app/(marketing)/page.tsx`)
Full marketing page:
- Navbar: logo, "Features", "Sign in" button, "Get Started" CTA
- Hero: "The operating system for your job search." headline, subheadline, "Continue with Google →" primary CTA, trust signals ("No credit card · 30s setup · Free forever")
- Feature grid: 6 cards with icons
- Stats bar: "10,000+ applications tracked", etc.
- Footer
- Dark theme, blue accent (#3b82f6)

### Auth Pages (`src/app/(auth)/`)
- Use `<SignIn />` and `<SignUp />` from `@clerk/nextjs`
- Configure `appearance` to match dark theme:
```typescript
appearance={{
  baseTheme: dark,
  variables: {
    colorBackground: '#0f0f0f',
    colorInputBackground: '#1a1a1a',
    colorText: '#f0f0f0',
    colorPrimary: '#3b82f6',
  }
}}
```

### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)
Two-panel layout:
- Left: fixed 240px sidebar
- Right: flex-1 main content with topbar

**Sidebar contents:**
- Logo + "AI Job Tracker" branding
- Nav items with icons:
  - Dashboard (`/dashboard`) — LayoutDashboard
  - Board (`/board`) — Kanban
  - Import Job (`/import`) — Plus
  - Jobs (`/jobs`) — Briefcase
  - Resumes (`/resumes`) — FileText
  - Discover (`/discover`) — Compass
  - Activity (`/activity`) — Activity
  - Settings (`/settings`) — Settings
- Bottom: user avatar + name + logout
- Search bar with ⌘K hint

**Topbar contents:**
- Breadcrumb (current page)
- Right: global search, theme toggle, notification bell, user menu

**Command Palette** (`src/components/layout/command-palette.tsx`):
- Triggered by ⌘K
- Search across jobs, applications, resumes
- Quick actions: "Import Job", "New Resume", "Go to Board"
- Use cmdk library

### Dashboard Page (`src/app/(dashboard)/dashboard/page.tsx`)

**Stat cards row 1 (4 cards):**
- Total Applications, Active Applications, Response Rate, Average Match Score

**Stat cards row 2 (3 cards):**
- Interview Rate, Offer Rate, Rejection Rate

**Charts row:**
- Left (60%): Applications per week — LineChart with Recharts
- Right (40%): Funnel Conversion — custom funnel with divs

**Bottom row:**
- Left (40%): Recent Activity Feed (last 10 activities)
- Right (60%): Pending Follow-Ups table

All data fetched via Server Actions with proper loading skeletons.

### Board Page (`src/app/(dashboard)/board/page.tsx`)

Full `@dnd-kit` drag-and-drop Kanban:

```typescript
// Kanban board architecture
// - DndContext wrapping all columns
// - SortableContext per column
// - Each card is a draggable item
// - onDragEnd: update application.stage + application.boardPosition
// - Persist to MongoDB via Server Action (optimistic update)
```

**Kanban Card** displays:
- Company logo (Cloudinary or fallback initials avatar)
- Job title (bold)
- Company name
- Location + type badge
- Salary range
- Match score ring (mini, colored)
- Days since last activity
- Application date
- Quick action icons: notes, view, move

**Column header:**
- Stage name
- Count badge
- "+" add card button

### Import Page (`src/app/(dashboard)/import/page.tsx`)

Three-tab interface:
1. **Paste JD** — large textarea, "Extract with AI" button, streaming progress indicator
2. **Job URL** — URL input, fetch+parse, preview extracted data
3. **Upload PDF** — UploadThing dropzone

After extraction:
- Show extracted data in a review panel (all fields editable)
- "Save Job" + "Save & Analyze" buttons
- Immediately redirect to job detail page after save

### Job Detail Page (`src/app/(dashboard)/jobs/[jobId]/page.tsx`)

Tab navigation (sticky):
1. **Overview** — title, company, location, salary, employment type, posted date, quick stats
2. **Job Description** — full JD with keyword highlighting
3. **Match Analysis** — score rings, skill gap visualization, suggestions
4. **Resume Versions** — all AI-optimized resumes for this job, diff viewer
5. **Cover Letters** — all generated cover letters, editor
6. **Outreach** — 5 message types with copy buttons
7. **Follow-Ups** — timeline of follow-ups, schedule new
8. **Interview Prep** — questions by category, mock chat interface
9. **Activity** — full chronological timeline

### Resumes Page (`src/app/(dashboard)/resumes/page.tsx`)

Two sections:
1. **Upload / Paste** — UploadThing + paste text with name input
2. **Resume Library** — grid of resume cards with: name, word count, skills count, last updated, "Set as Master" toggle, version history accordion

### Discover Page (`src/app/(dashboard)/discover/page.tsx`)

Top: filter form (roles, skills, locations, remote pref, experience level) → "Find Jobs with AI"

Results: grid of recommendation cards showing:
- Job title + company
- Location
- Estimated salary
- Match score badge (color-coded)
- "Why apply" snippet
- Missing skills chips
- Priority score bar
- Actions: "Save Job", "Add to Tracker", "Find on LinkedIn"

---

## SERVER ACTIONS

### `src/lib/actions/job.actions.ts`

```typescript
'use server'

export async function createJob(data: CreateJobInput): Promise<ActionResult<Job>>
export async function updateJob(jobId: string, data: UpdateJobInput): Promise<ActionResult<Job>>
export async function deleteJob(jobId: string): Promise<ActionResult<void>>
export async function getJobs(filters?: JobFilters): Promise<ActionResult<Job[]>>
export async function getJobById(jobId: string): Promise<ActionResult<Job>>
export async function importJobFromUrl(url: string): Promise<ActionResult<ParsedJob>>
export async function parseJobDescription(jd: string): Promise<ActionResult<ParsedJob>>
```

### `src/lib/actions/application.actions.ts`

```typescript
'use server'

export async function createApplication(data: CreateApplicationInput): Promise<ActionResult<Application>>
export async function updateApplicationStage(
  applicationId: string,
  stage: KanbanStage,
  position: number
): Promise<ActionResult<Application>>
export async function getApplicationsByStage(): Promise<ActionResult<Record<KanbanStage, Application[]>>>
export async function getDashboardStats(): Promise<ActionResult<DashboardStats>>
```

### `src/lib/actions/ai.actions.ts`

```typescript
'use server'

export async function analyzeJobMatch(jobId: string, resumeId: string): Promise<ActionResult<AIAnalysis>>
export async function generateOptimizedResume(jobId: string, resumeId: string): Promise<ActionResult<ResumeVersion>>
export async function generateCoverLetter(jobId: string, tone: CoverLetterTone): Promise<ActionResult<CoverLetter>>
export async function generateOutreach(jobId: string): Promise<ActionResult<OutreachMessage[]>>
export async function generateInterviewPrep(applicationId: string): Promise<ActionResult<InterviewPrep>>
export async function generateFollowUp(applicationId: string, type: FollowUpType): Promise<ActionResult<FollowUp>>
export async function discoverJobs(preferences: UserPreferences): Promise<ActionResult<JobRecommendation[]>>
```

All actions must:
1. Call `auth()` from `@clerk/nextjs/server` and throw if unauthenticated
2. Validate input with Zod
3. Connect to MongoDB via the singleton
4. Log activity via `activityActions.log()`
5. Return `{ success: true, data }` or `{ success: false, error: string }`

---

## API ROUTES

### `src/app/api/webhooks/clerk/route.ts`
Handle `user.created` and `user.updated` events:
- On `user.created`: create User document + Profile document + Settings document
- On `user.updated`: sync email, name, imageUrl

### `src/app/api/uploadthing/core.ts`
```typescript
export const ourFileRouter = {
  resumeUpload: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const { userId } = auth()
      if (!userId) throw new UploadThingError('Unauthorized')
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Parse PDF text, save Resume document
      return { uploadedBy: metadata.userId }
    }),
  profileImage: f({ image: { maxFileSize: '2MB' } })
    .middleware(...)
    .onUploadComplete(...)
}
```

---

## UI DESIGN SYSTEM

### Colors (CSS variables in `globals.css`)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  /* ... full shadcn light theme */
}

.dark {
  --background: 0 0% 4%;            /* #0a0a0a */
  --foreground: 0 0% 94.1%;
  --card: 0 0% 7%;                  /* #111111 */
  --card-foreground: 0 0% 94.1%;
  --popover: 0 0% 7%;
  --popover-foreground: 0 0% 94.1%;
  --primary: 217 91% 60%;           /* #3b82f6 blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 11%;
  --secondary-foreground: 0 0% 94.1%;
  --muted: 0 0% 11%;
  --muted-foreground: 0 0% 54.5%;
  --accent: 0 0% 14%;
  --accent-foreground: 0 0% 94.1%;
  --destructive: 0 84% 60%;
  --border: 0 0% 18%;               /* #2e2e2e */
  --input: 0 0% 18%;
  --ring: 217 91% 60%;
}
```

### Typography

```typescript
// Use Inter variable font
// Page titles: text-3xl font-bold tracking-tight
// Section labels: text-xs uppercase tracking-widest text-muted-foreground
// Stat values: text-4xl font-bold tabular-nums
// Body: text-sm leading-relaxed
// Code/mono: font-mono text-xs
```

### Component Patterns

**StatCard:**
```tsx
<Card className="bg-card border-border">
  <CardContent className="p-6">
    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
    <p className="text-4xl font-bold tabular-nums">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{trend}</p>
  </CardContent>
</Card>
```

**MatchScoreRing:** SVG circle with stroke-dashoffset animation, color-coded:
- 80-100: green (#22c55e)
- 60-79: yellow (#eab308)
- 40-59: orange (#f97316)
- 0-39: red (#ef4444)

**EmptyState:**
```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <Icon className="h-12 w-12 text-muted-foreground/30 mb-4" />
  <h3 className="text-lg font-semibold mb-2">{title}</h3>
  <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
  <Button onClick={action}>{actionLabel}</Button>
</div>
```

**AIThinking:** animated skeleton with "✦ Analyzing with Gemini..." text

---

## KEYBOARD SHORTCUTS

Implement globally in `src/lib/hooks/use-keyboard-shortcuts.ts`:

| Shortcut | Action |
|---|---|
| ⌘K | Open command palette |
| ⌘N | Import new job |
| ⌘B | Go to Board |
| ⌘D | Go to Dashboard |
| ⌘/ | Focus search |
| Escape | Close modal / palette |

---

## MIDDLEWARE

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

---

## PACKAGE.JSON

```json
{
  "name": "ai-job-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@clerk/nextjs": "^6",
    "@dnd-kit/core": "^6",
    "@dnd-kit/sortable": "^8",
    "@dnd-kit/utilities": "^3",
    "@google/generative-ai": "^0.24",
    "@hookform/resolvers": "^4",
    "@radix-ui/react-*": "latest",
    "@react-pdf/renderer": "^4",
    "@tanstack/react-query": "^5",
    "@uploadthing/react": "^7",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "cmdk": "^1",
    "date-fns": "^4",
    "lucide-react": "^0.469",
    "mongoose": "^8",
    "next": "15.3.3",
    "next-themes": "^0.4",
    "react": "19",
    "react-dom": "19",
    "react-hook-form": "^7",
    "recharts": "^2",
    "sonner": "^1",
    "svix": "^1",
    "tailwind-merge": "^2",
    "tailwindcss-animate": "^1",
    "uploadthing": "^7",
    "zod": "^3",
    "zustand": "^5"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## SHADCN CONFIG (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils/cn",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/lib/hooks"
  }
}
```

Pre-install these shadcn components:
`button, card, badge, input, textarea, select, dialog, sheet, tabs, dropdown-menu, avatar, separator, skeleton, progress, scroll-area, tooltip, popover, command, form, label, switch, toggle, toggle-group, calendar, table, alert, alert-dialog`

---

## NEXT.CONFIG.TS

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'img.clerk.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'logo.clearbit.com' },
      { hostname: 'utfs.io' },
      { hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
}

export default nextConfig
```

---

## BUILD ORDER

Generate files in this exact sequence to avoid import errors:

1. `package.json` + `tsconfig.json` + `next.config.ts` + `components.json`
2. `.env.local.example` + `.gitignore`
3. `src/types/**`
4. `src/lib/constants/**`
5. `src/lib/db/connect.ts`
6. `src/lib/db/models/**` (all 17 models)
7. `src/lib/ai/gemini.ts`
8. `src/lib/ai/prompts/**` (all 8 prompts)
9. `src/lib/ai/services/**` (all 8 services)
10. `src/lib/validations/**`
11. `src/lib/utils/**`
12. `src/lib/actions/**`
13. `src/lib/hooks/**`
14. `src/middleware.ts`
15. `src/app/globals.css`
16. `src/app/layout.tsx` (root)
17. `src/components/providers/**`
18. `src/components/ui/**` (shadcn)
19. `src/components/shared/**`
20. `src/components/layout/**`
21. `src/app/(auth)/**`
22. `src/app/(marketing)/**`
23. `src/components/dashboard/**`
24. `src/app/(dashboard)/layout.tsx`
25. `src/app/(dashboard)/dashboard/**`
26. `src/components/board/**`
27. `src/app/(dashboard)/board/**`
28. `src/components/import/**`
29. `src/app/(dashboard)/import/**`
30. `src/components/jobs/**`
31. `src/app/(dashboard)/jobs/**`
32. `src/components/resumes/**`
33. `src/app/(dashboard)/resumes/**`
34. `src/app/(dashboard)/discover/**`
35. `src/app/(dashboard)/activity/**`
36. `src/app/(dashboard)/settings/**`
37. `src/app/api/**`
38. `public/**`

---

## QUALITY REQUIREMENTS

- Every Server Action validates auth with `auth()` from `@clerk/nextjs/server`
- Every MongoDB operation uses the singleton `connectDB()` helper
- Every API route has proper error handling and returns typed responses
- All loading states use skeleton components (not spinners)
- All empty states have contextual CTAs
- All forms use React Hook Form + Zod validation
- All AI calls use `generateWithRetry()` for reliability
- Optimistic updates on all Kanban drag operations
- All timestamps displayed as relative time (e.g. "2 days ago") via date-fns
- Mobile responsive: sidebar collapses to bottom nav on `< md`
- Dark mode is the default; light mode available via theme toggle

---

## START

Begin immediately with file 1. Write every file in full. Do not stop until the entire application is generated.
