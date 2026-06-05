export type KanbanStage =
  | 'saved'
  | 'interested'
  | 'applied'
  | 'assessment'
  | 'screening'
  | 'interview_1'
  | 'interview_2'
  | 'final'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'ghosted'
  | 'withdrawn'

export type ApplicationStatus = 'active' | 'archived'
export type Priority = 'low' | 'medium' | 'high'

export interface StageHistoryEntry {
  stage: KanbanStage
  date: Date | string
  note?: string
}

export interface IApplication {
  _id: string
  userId: string
  jobId: string
  resumeVersionId?: string
  stage: KanbanStage
  status: ApplicationStatus
  appliedDate?: Date | string
  lastActivityDate?: Date | string
  applicationUrl?: string
  portalUsername?: string
  contactName?: string
  contactEmail?: string
  contactLinkedin?: string
  salaryExpectation?: number
  notes?: string
  priority: Priority
  boardPosition: number
  aiAnalysisId?: string
  coverLetterId?: string
  stageHistory: StageHistoryEntry[]
  createdAt: Date | string
  updatedAt: Date | string
  // Populated fields
  job?: {
    _id: string
    title: string
    company: string
    companyLogoUrl?: string
    location?: string
    locationType?: string
    salaryMin?: number
    salaryMax?: number
    salaryCurrency?: string
  }
}

export interface CreateApplicationInput {
  jobId: string
  resumeVersionId?: string
  stage?: KanbanStage
  appliedDate?: string
  applicationUrl?: string
  portalUsername?: string
  contactName?: string
  contactEmail?: string
  contactLinkedin?: string
  salaryExpectation?: number
  notes?: string
  priority?: Priority
}

export interface DashboardStats {
  totalApplications: number
  activeApplications: number
  responseRate: number
  avgMatchScore: number
  interviewRate: number
  offerRate: number
  rejectionRate: number
  weeklyData: WeeklyDataPoint[]
  funnelData: FunnelDataPoint[]
}

export interface WeeklyDataPoint {
  week: string
  applications: number
  interviews: number
  offers: number
}

export interface FunnelDataPoint {
  stage: string
  count: number
  percentage: number
}
