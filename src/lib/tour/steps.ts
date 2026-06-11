export interface TourStep {
  selector: string
  title: string
  description: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

export interface TourPage {
  path: string
  label: string
  steps: TourStep[]
}

export const TOUR_PAGES: TourPage[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    steps: [
      {
        selector: '[data-tour="sidebar"]',
        title: 'Navigation',
        description: 'Access every section from this sidebar. Use <strong>⌘K</strong> to search and jump to any job, resume, or action instantly.',
        side: 'right',
        align: 'start',
      },
      {
        selector: '[data-tour="stat-cards"]',
        title: 'Your Job Search Stats',
        description: 'Track total applications, response rate, interview rate, average match score, and funnel conversion — all in real time.',
        side: 'bottom',
        align: 'start',
      },
    ],
  },
  {
    path: '/import',
    label: 'Import',
    steps: [
      {
        selector: '[data-tour="import-tabs"]',
        title: 'Import Any Job Posting',
        description: 'Paste a job description, drop in a URL, or upload a PDF. AI extracts every detail — title, salary, required skills, tech stack — automatically. No manual entry.',
        side: 'bottom',
        align: 'start',
      },
    ],
  },
  {
    path: '/board',
    label: 'Board',
    steps: [
      {
        selector: '[data-tour="kanban-board"]',
        title: 'Drag-and-Drop Pipeline',
        description: 'Move applications across 13 stages — Saved → Applied → Screening → Interviews → Offer → Accepted. Every stage change is timestamped and logged automatically.',
        side: 'bottom',
        align: 'start',
      },
    ],
  },
  {
    path: '/jobs',
    label: 'Jobs',
    steps: [
      {
        selector: '[data-tour="jobs-content"]',
        title: 'Jobs Library',
        description: 'All your imported jobs live here. Click any job to open its full AI toolkit: match score, optimized resume, cover letter, outreach messages, interview prep, and follow-ups.',
        side: 'bottom',
        align: 'start',
      },
    ],
  },
  {
    path: '/resumes',
    label: 'Resumes',
    steps: [
      {
        selector: '[data-tour="resume-upload"]',
        title: 'Upload Your Master Resume',
        description: 'Add your base resume here. AI will create tailored, ATS-optimized versions for each job you apply to — without modifying the original.',
        side: 'right',
        align: 'start',
      },
    ],
  },
  {
    path: '/settings',
    label: 'Settings',
    steps: [
      {
        selector: '[data-tour="ai-provider"]',
        title: 'Add Your AI API Key',
        description: 'Connect your Google Gemini, OpenAI, or Anthropic Claude key here to unlock all AI features. Your key is stored only in this browser — we never see it.',
        side: 'bottom',
        align: 'start',
      },
    ],
  },
]

export const TOTAL_STEPS = TOUR_PAGES.reduce((sum, p) => sum + p.steps.length, 0)

export function getTourGlobalStart(pageIdx: number): number {
  return TOUR_PAGES.slice(0, pageIdx).reduce((sum, p) => sum + p.steps.length, 0)
}
