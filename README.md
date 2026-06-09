# AI Job Tracker

> The operating system for your job search.

Stop tracking applications in spreadsheets. AI Job Tracker brings together every part of your job search — importing, analyzing, applying, following up, and preparing for interviews — into one intelligent, keyboard-driven workspace.

---

## Your API Key — Privacy First

AI Job Tracker ships with **zero AI credentials**. There is no `GEMINI_API_KEY` or any other AI key in the environment. You bring your own.

Go to **Settings → AI Provider** and connect any of:

| Provider | Models |
|---|---|
| Google Gemini | Gemini 2.5 Flash, Gemini 2.5 Pro |
| OpenAI | GPT-4o Mini, GPT-4o |
| Anthropic Claude | Claude Haiku 4.5, Claude Sonnet 4.6, Claude Opus 4.8 |

**Your key is stored only in your browser's `localStorage`** — it is never written to our database, never logged, and never visible to us. When you trigger an AI action, the key travels directly from your browser to the server action, is used for that single call, and is immediately discarded. You stay in full control of your AI usage and costs.

---

## Features

### Import Any Job in Seconds
Paste a job description, drop in a URL, or upload a PDF. AI extracts the title, company, skills, salary, location, seniority, tech stack, and every other detail automatically. No manual entry.

### Know Your Odds Before You Apply
Get a match score across 5 dimensions — Skills, Experience, ATS compatibility, Keywords, and Overall fit — with a full skill gap breakdown and tailored suggestions to improve your application before you send it.

### Resumes That Get Past ATS
Generate a role-specific version of your resume, optimized for the job's exact keywords and requirements. Every version is saved with its ATS score, change log, and date so you always have a full history.

### Cover Letters That Sound Like You
Choose your tone — Professional, Startup, Enterprise, FAANG, or Remote-first — and get a ready-to-send cover letter in seconds. Edit it inline, copy it, or generate another.

### Reach Out With Confidence
Five outreach messages generated in one click: recruiter email, hiring manager email, LinkedIn connection request, LinkedIn follow-up, and cold outreach. All personalized to the role and company.

### Never Miss a Follow-Up
Generate follow-up emails timed to your application — 3-day, 7-day, 14-day, or post-interview. Every message is saved and timestamped so you know exactly what was sent and when.

### Walk Into Every Interview Prepared
Get a full prep kit per role: technical questions, behavioral questions, company-specific questions, system design topics, a readiness score, and a step-by-step prep plan — all generated from the actual job description.

### Track Everything on a Kanban Board
Move applications through 13 stages with drag-and-drop — from Saved and Interested all the way to Offer, Accepted, Rejected, Ghosted, and Withdrawn. Every stage change is logged automatically.

### Your Entire Search in One Timeline
A full activity feed shows every import, analysis, resume generation, cover letter, outreach message, interview prep, and stage change — grouped by date, with colored icons for instant scanning.

### Discover What to Apply For Next
Describe your skills and target roles, and AI surfaces job recommendations with match scores, salary estimates, missing skill gaps, and a search query — ready to act on immediately.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (React 19) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui (New York) |
| State | Zustand + TanStack Query v5 |
| Database | MongoDB Atlas via Mongoose |
| Auth | Clerk (Google OAuth + GitHub OAuth + Email) |
| AI | Bring your own key — Gemini / OpenAI / Anthropic |
| File Storage | UploadThing |
| Image CDN | Cloudinary |
| Charts | Recharts |
| DnD | @dnd-kit |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd ai-job-tracker
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# MongoDB
MONGODB_URI=

# UploadThing
UPLOADTHING_TOKEN=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> There are no AI-related env vars. Users supply their own keys in the app.

### 3. Set up Clerk webhook

In the Clerk dashboard, create a webhook pointing to `<your-url>/api/webhooks/clerk` and subscribe to `user.created` and `user.updated` events. Paste the signing secret into `CLERK_WEBHOOK_SECRET`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Built For

- **Active job seekers** running 10+ applications in parallel who need to stay organized without drowning in tabs
- **Career changers** who need to understand skill gaps and tailor every application to a new field
- **Engineers and designers** who want a tool that feels as polished as the products they build

---

## Coming Soon

- Email delivery for follow-up reminders and weekly digest (preferences can be saved in Settings now)
- Chrome extension for one-click job import
- LinkedIn profile import

---

## License

MIT
