export type UserPlan = 'free' | 'pro'
export type RemotePreference = 'remote' | 'hybrid' | 'onsite' | 'any'
export type ExperienceLevel =
  | 'intern'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'staff'
  | 'principal'
  | 'executive'

export interface IUser {
  _id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  imageUrl: string
  onboardingComplete: boolean
  plan: UserPlan
  createdAt: Date | string
  updatedAt: Date | string
}

export interface IProfile {
  _id: string
  userId: string
  headline?: string
  summary?: string
  targetRoles: string[]
  targetLocations: string[]
  targetSalaryMin?: number
  targetSalaryMax?: number
  remotePreference: RemotePreference
  experienceLevel?: ExperienceLevel
  skills: string[]
  industries: string[]
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  activeJobSearching: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ISettings {
  _id: string
  userId: string
  emailNotifications: boolean
  followUpReminders: boolean
  weeklyDigest: boolean
  theme: 'dark' | 'light' | 'system'
  defaultResumeId?: string
  timezone: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type ActivityType =
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

export interface IActivity {
  _id: string
  userId: string
  jobId?: string
  applicationId?: string
  type: ActivityType
  title: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: Date | string
}
