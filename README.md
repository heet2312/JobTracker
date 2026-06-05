# AI Job Tracker

> The operating system for your job search.

A full-stack, AI-native job application tracker inspired by Linear × Notion × Ashby. Dark-first, keyboard-driven, and powered by Google Gemini for deep match analysis, resume optimization, cover letter generation, outreach drafting, and interview prep — all in one place.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [External Service Setup](#external-service-setup)
  - [Clerk — Authentication](#clerk--authentication)
  - [MongoDB Atlas — Database](#mongodb-atlas--database)
  - [Google Gemini — AI](#google-gemini--ai)
  - [UploadThing — File Storage](#uploadthing--file-storage)
  - [Cloudinary — Image CDN](#cloudinary--image-cdn)
- [Development](#development)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Features

### Implemented

| Feature | Description |
|---|---|
| **Job Import** | Import jobs by pasting a JD, entering a URL, or uploading a PDF — AI extracts all structured data |
| **Kanban Board** | Drag-and-drop board with 13 stages (Saved → Accepted / Rejected / Ghosted) |
| **Match Analysis** | Gemini Pro scores your resume against a job across 5 dimensions with skill gap breakdown |
| **Resume Optimizer** | Gemini Pro rewrites your resume for ATS and keyword match; versioned history per job |
| **Cover Letter Generator** | 5 tone variants (Professional, Startup, Enterprise, FAANG, Remote-first) with inline editor |
| **Outreach Messages** | 5 message types generated in one shot: recruiter email, hiring manager email, LinkedIn connect/follow-up, cold outreach |
| **Follow-up Drafts** | AI-generated follow-up emails for 3-day, 7-day, 14-day, post-interview, and custom timelines |
| **Interview Prep** | Role-specific technical, behavioral, and company questions with sample answers and a prep plan |
| **AI Persistence** | All generated content is saved to MongoDB with timestamps; visible on every revisit |
| **Activity Timeline** | Full chronological log of every action grouped by date, with colored icon types |
| **Dashboard Stats** | Application funnel, weekly trend chart, response/interview/offer rates |
| **Job Discovery** | Gemini Pro recommends roles based on your profile with match scores and search queries |
| **Resume Library** | Upload or paste resumes, set a master resume, track all AI-optimized versions |
| **Command Palette** | ⌘K palette for navigation and quick actions |
| **Dark / Light Mode** | System-aware theme toggle |
| **Auth** | Google OAuth, GitHub OAuth, and email sign-up via Clerk |

### Coming Soon

- Email notifications and follow-up reminders
- Weekly digest emails
- Notification center
- Auto-tracking jobs from the Discover page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5 — strict mode |
| Styling | Tailwind CSS v3 + shadcn/ui (New York style) |
| State | Zustand (client) + TanStack Query v5 (server state) |
| Database | MongoDB Atlas via Mongoose v8 |
| Auth | Clerk v6 — Google / GitHub / Email |
| AI | Google Gemini 2.5 Flash (fast ops) + Gemini 2.5 Pro (deep analysis) |
| File Storage | UploadThing v7 |
| Image CDN | Cloudinary |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Forms | React Hook Form v7 + Zod v3 |
| Charts | Recharts v2 |
| PDF | @react-pdf/renderer v4 |
| Package Manager | pnpm v9 |
| Deployment | Vercel |

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 20 or later — [nodejs.org](https://nodejs.org)
- **pnpm** 9 — `npm install -g pnpm`
- Accounts on: Clerk, MongoDB Atlas, Google AI Studio, UploadThing, Cloudinary (all have free tiers)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-job-tracker.git
cd ai-job-tracker
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in every value. See [Environment Variables](#environment-variables) for the full reference and [External Service Setup](#external-service-setup) for step-by-step instructions per service.

### 4. Start the development server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Set up the Clerk webhook (required for user creation)

Run the following in a separate terminal to expose your local server:

```bash
npx clerk-webhook-proxy  # or use ngrok / localtunnel
```

Then configure the webhook endpoint in the Clerk dashboard pointing to:
```
https://<your-tunnel>.ngrok.io/api/webhooks/clerk
```

Subscribe to `user.created` and `user.updated` events.

---

## Environment Variables

Create `.env.local` at the project root. All variables are required unless marked optional.

```bash
# ─── Clerk ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_...          # from Clerk dashboard → Webhooks

# ─── MongoDB ──────────────────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ai-job-tracker?retryWrites=true&w=majority

# ─── Google Gemini ────────────────────────────────────────────────────────────
GEMINI_API_KEY=AIza...
GEMINI_FLASH_MODEL=gemini-2.5-flash-preview-05-20
GEMINI_PRO_MODEL=gemini-2.5-pro-preview-05-06

# ─── UploadThing ──────────────────────────────────────────────────────────────
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# ─── Cloudinary ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# ─── App ──────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## External Service Setup

### Clerk — Authentication

1. Go to [clerk.com](https://clerk.com) and create an application.
2. Enable **Google** and **GitHub** social providers under **User & Authentication → Social Connections**.
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` from **API Keys**.
4. Under **Webhooks**, create a new endpoint:
   - URL: `https://yourdomain.com/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`
   - Copy the **Signing Secret** as `CLERK_WEBHOOK_SECRET`.

> **Local development:** Use [ngrok](https://ngrok.com) or `npx localtunnel --port 3000` to expose localhost and point the webhook there.

---

### MongoDB Atlas — Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. Under **Database Access**, create a user with **Read and Write** permissions.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for development).
4. Click **Connect → Drivers**, copy the connection string, and replace `<password>` with your user's password.
5. Append `?retryWrites=true&w=majority` if not already present.
6. Set this as `MONGODB_URI`.

> **Database name:** The app uses `ai-job-tracker` by default. You can change it in the connection string.

---

### Google Gemini — AI

1. Go to [aistudio.google.com](https://aistudio.google.com) and sign in.
2. Click **Get API key** → **Create API key**.
3. Set it as `GEMINI_API_KEY`.
4. The app uses two models:
   - `GEMINI_FLASH_MODEL` — fast operations (parsing, outreach, follow-ups)
   - `GEMINI_PRO_MODEL` — deep analysis (match scoring, resume optimization, interview prep)

> **Note:** Gemini 2.5 Pro is rate-limited on the free tier. For high usage, enable billing at [console.cloud.google.com](https://console.cloud.google.com).

---

### UploadThing — File Storage

1. Go to [uploadthing.com](https://uploadthing.com) and create an app.
2. Copy **Secret Key** → `UPLOADTHING_SECRET`
3. Copy **App ID** → `UPLOADTHING_APP_ID`

Used for: resume PDF uploads (max 4 MB per file).

---

### Cloudinary — Image CDN

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account.
2. From the dashboard, copy:
   - **Cloud Name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

Used for: company logo hosting and serving.

---

## Development

```bash
# Start dev server with Turbopack
pnpm dev

# Type-check only (no emit)
pnpm type-check

# Lint
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Open command palette |
| `⌘N` | Import new job |
| `⌘B` | Go to Board |
| `⌘D` | Go to Dashboard |
| `Escape` | Close modal / palette |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Sign-in / Sign-up pages (Clerk)
│   ├── (marketing)/               # Landing page
│   ├── (dashboard)/               # Authenticated app shell
│   │   ├── layout.tsx             # Sidebar + topbar
│   │   ├── dashboard/             # Stats, charts, activity feed
│   │   ├── board/                 # Drag-and-drop Kanban
│   │   ├── jobs/                  # Job list + detail tabs
│   │   │   └── [jobId]/
│   │   │       └── _components/   # One component per tab
│   │   ├── import/                # Paste JD / URL / PDF upload
│   │   ├── resumes/               # Resume library
│   │   ├── discover/              # AI job recommendations
│   │   ├── activity/              # Full activity history
│   │   └── settings/              # Account and preferences
│   └── api/
│       ├── webhooks/clerk/        # User sync from Clerk
│       └── uploadthing/           # File upload router
│
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── layout/                    # Sidebar, topbar, command palette
│   ├── dashboard/                 # Stat cards, charts
│   ├── board/                     # Kanban board, column, card
│   ├── ai/                        # Match score ring, AI thinking, skill gap
│   └── shared/                    # Empty state, copy button, skeletons
│
├── lib/
│   ├── db/
│   │   ├── connect.ts             # Mongoose singleton
│   │   └── models/                # 17 Mongoose models
│   ├── ai/
│   │   ├── gemini.ts              # Gemini client (flash + pro)
│   │   ├── prompts/               # Prompt templates per feature
│   │   └── services/              # AI service functions
│   ├── actions/                   # Next.js Server Actions
│   ├── hooks/                     # React hooks (TanStack Query)
│   ├── validations/               # Zod schemas
│   ├── utils/                     # cn, format, date, pdf helpers
│   └── constants/                 # Kanban stages, routes, AI models
│
└── types/                         # TypeScript interfaces
```

---

## Database Models

| Model | Purpose |
|---|---|
| `User` | Clerk-linked user record |
| `Profile` | Job search preferences, skills, target roles |
| `Resume` | Master resume text + parsed data |
| `ResumeVersion` | AI-optimized resume per job (versioned) |
| `Job` | Imported job with AI-extracted structured data |
| `Company` | Company metadata |
| `Application` | Kanban card — links job + resume + stage history |
| `AIAnalysis` | Match scores and skill gap for a job/resume pair |
| `CoverLetter` | Generated cover letter (multiple tones per job) |
| `OutreachMessage` | 5-type outreach messages per job |
| `FollowUp` | Follow-up email drafts per application |
| `InterviewRound` | Interview rounds + AI prep (questions, prep plan) |
| `Activity` | Append-only activity log |
| `Notification` | In-app notifications (coming soon) |
| `Settings` | Per-user app preferences |
| `JobRecommendation` | AI-discovered job suggestions |

---

## Deployment

### Vercel (recommended)

1. Push your code to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` in the **Environment Variables** section.
4. Deploy. Vercel auto-detects Next.js — no build config needed.
5. After the first deploy, update your Clerk webhook endpoint URL to the production domain.
6. Update `NEXT_PUBLIC_APP_URL` to your production URL.

> **Server Actions body limit:** The app is configured for 10 MB server action bodies (`next.config.ts`), which Vercel's Pro plan supports. The free Hobby plan is capped at 4.5 MB — sufficient for most use cases.

### Environment variables checklist for production

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` — production keys from Clerk
- [ ] `CLERK_WEBHOOK_SECRET` — from the production webhook endpoint
- [ ] `MONGODB_URI` — Atlas connection string with allowlisted Vercel IP ranges (or `0.0.0.0/0`)
- [ ] `GEMINI_API_KEY` — with billing enabled for sustained usage
- [ ] `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`
- [ ] `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] `NEXT_PUBLIC_APP_URL` — set to `https://yourdomain.com`

---

## Roadmap

- [ ] Email notifications and follow-up reminder emails (Gmail API)
- [ ] Weekly digest emails with progress summary
- [ ] In-app notification center
- [ ] Auto-track jobs from the Discover page
- [ ] Chrome extension for one-click job import
- [ ] PDF export for resumes and cover letters
- [ ] LinkedIn profile import
- [ ] Team / shared workspace support
- [ ] Pro plan with higher AI usage limits

---

## License

MIT — see [LICENSE](LICENSE) for details.
