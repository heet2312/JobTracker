export type LocationType = 'remote' | 'hybrid' | 'onsite'
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type ImportMethod = 'url' | 'paste' | 'pdf'

export interface IJob {
  _id: string
  userId: string
  sourceUrl?: string
  rawDescription?: string
  importMethod: ImportMethod
  title: string
  company: string
  companyWebsite?: string
  companyLogoUrl?: string
  location?: string
  locationType?: LocationType
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  employmentType?: EmploymentType
  experienceRequired?: string
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  keywords: string[]
  industry?: string
  department?: string
  seniorityLevel?: string
  benefits: string[]
  techStack: string[]
  applicationDeadline?: Date | string
  postedDate?: Date | string
  isActive: boolean
  isFavorited: boolean
  notes?: string
  tags: string[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ParsedJob {
  title: string
  company: string
  companyWebsite: string
  location: string
  locationType: LocationType
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

export interface JobFilters {
  search?: string
  locationType?: LocationType
  employmentType?: EmploymentType
  isFavorited?: boolean
  tags?: string[]
  industry?: string
}

export interface CreateJobInput {
  sourceUrl?: string
  rawDescription?: string
  importMethod: ImportMethod
  title: string
  company: string
  companyWebsite?: string
  location?: string
  locationType?: LocationType
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  employmentType?: EmploymentType
  experienceRequired?: string
  requiredSkills?: string[]
  preferredSkills?: string[]
  responsibilities?: string[]
  keywords?: string[]
  industry?: string
  department?: string
  seniorityLevel?: string
  benefits?: string[]
  techStack?: string[]
  applicationDeadline?: string
  postedDate?: string
  notes?: string
  tags?: string[]
}

export type UpdateJobInput = Partial<CreateJobInput>
