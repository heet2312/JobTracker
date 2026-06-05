export interface IAIAnalysis {
  _id: string
  userId: string
  jobId: string
  resumeId: string
  overallScore: number
  skillsScore: number
  experienceScore: number
  atsScore: number
  keywordScore: number
  applicationProbability: number
  missingSkills: string[]
  missingKeywords: string[]
  matchedSkills: string[]
  matchedKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  scoreBreakdown: Record<string, number>
  generatedAt: Date | string
  model: string
}

export interface MatchScore {
  overallScore: number
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

export interface GeneratedCoverLetter {
  subject: string
  content: string
  wordCount: number
  tone: string
  highlights: string[]
}

export type CoverLetterTone = 'professional' | 'startup' | 'enterprise' | 'faang' | 'remote'

export interface ICoverLetter {
  _id: string
  userId: string
  jobId: string
  applicationId?: string
  resumeId?: string
  tone: CoverLetterTone
  content: string
  subject: string
  wordCount: number
  version: number
  isActive: boolean
  generatedAt: Date | string
  editedAt?: Date | string
}

export interface OutreachMessages {
  recruiterEmail: { subject: string; body: string }
  hiringManagerEmail: { subject: string; body: string }
  linkedinConnect: { message: string }
  linkedinFollowup: { message: string }
  coldOutreach: { subject: string; body: string }
}

export type OutreachType =
  | 'recruiter-email'
  | 'hiring-manager-email'
  | 'linkedin-connect'
  | 'linkedin-followup'
  | 'cold-outreach'

export interface IOutreachMessage {
  _id: string
  userId: string
  jobId: string
  type: OutreachType
  recipientName?: string
  recipientTitle?: string
  recipientCompany?: string
  subject?: string
  content: string
  generatedAt: Date | string
  copiedAt?: Date | string
  sentAt?: Date | string
  status: 'draft' | 'copied' | 'sent' | 'responded'
}

export interface Question {
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  sampleAnswer: string
}

export interface InterviewPrep {
  technicalQuestions: Question[]
  behavioralQuestions: Question[]
  companyQuestions: Question[]
  systemDesignTopics: string[]
  readinessScore: number
  prepPlan: string[]
}

export interface IStoredInterviewPrep extends InterviewPrep {
  _id: string
  applicationId: string
  createdAt: Date | string
}

export type FollowUpType = '3-day' | '7-day' | '14-day' | 'post-interview' | 'custom'

export interface FollowUpMessage {
  subject: string
  content: string
  type: string
  bestSendTime: string
}

export interface IFollowUp {
  _id: string
  userId: string
  applicationId: string
  type: FollowUpType
  scheduledDate?: Date | string
  sentDate?: Date | string
  status: 'pending' | 'sent' | 'responded' | 'skipped'
  channel: 'email' | 'linkedin' | 'phone'
  recipient?: string
  subject?: string
  content: string
  response?: string
  reminderSent: boolean
  createdAt: Date | string
}

export interface JobRecommendation {
  title: string
  company: string
  location: string
  estimatedSalary: string
  matchScore: number
  matchReason: string
  missingSkills: string[]
  priorityScore: number
  whyApply: string
  searchQuery: string
}

export interface UserPreferences {
  targetRoles: string[]
  skills: string[]
  targetLocations: string[]
  remotePreference: string
  experienceLevel: string
  industries: string[]
  targetSalaryMin?: number
  targetSalaryMax?: number
}
