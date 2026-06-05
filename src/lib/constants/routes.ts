export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  DASHBOARD: '/dashboard',
  BOARD: '/board',
  IMPORT: '/import',
  JOBS: '/jobs',
  JOB: (id: string) => `/jobs/${id}`,
  RESUMES: '/resumes',
  DISCOVER: '/discover',
  ACTIVITY: '/activity',
  SETTINGS: '/settings',
} as const
