export interface ExperienceItem {
  company: string
  title: string
  startDate: string
  endDate?: string
  current?: boolean
  description: string
  achievements: string[]
  location?: string
}

export interface EducationItem {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  gpa?: string
  honors?: string
}

export interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface ParsedResumeData {
  summary: string
  experience: ExperienceItem[]
  education: EducationItem[]
  skills: string[]
  certifications: string[]
  projects: ProjectItem[]
}

export interface IResume {
  _id: string
  userId: string
  name: string
  isMaster: boolean
  content: string
  fileUrl?: string
  fileKey?: string
  parsedData?: ParsedResumeData
  wordCount: number
  versions: string[]
  isActive: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface IResumeVersion {
  _id: string
  resumeId: string
  userId: string
  jobId?: string
  versionNumber: number
  content: string
  fullText: string
  changes: string[]
  atsScore?: number
  wordCount: number
  isActive: boolean
  createdAt: Date | string
}

export interface ResumeExperience {
  company: string
  title: string
  startDate: string
  endDate?: string
  description: string
  achievements: string[]
}

export interface OptimizedResume {
  summary: string
  experience: ResumeExperience[]
  skills: string[]
  keywords: string[]
  changes: string[]
  atsScore: number
  wordCount: number
  fullText: string
}
