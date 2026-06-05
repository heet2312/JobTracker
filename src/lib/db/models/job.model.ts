import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IJobDocument extends Document {
  userId: Types.ObjectId
  sourceUrl?: string
  rawDescription?: string
  importMethod: 'url' | 'paste' | 'pdf'
  title: string
  company: string
  companyWebsite?: string
  companyLogoUrl?: string
  location?: string
  locationType?: 'remote' | 'hybrid' | 'onsite'
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship'
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
  applicationDeadline?: Date
  postedDate?: Date
  isActive: boolean
  isFavorited: boolean
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new Schema<IJobDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sourceUrl: String,
    rawDescription: String,
    importMethod: { type: String, enum: ['url', 'paste', 'pdf'], default: 'paste' },
    title: { type: String, required: true, index: true },
    company: { type: String, required: true, index: true },
    companyWebsite: String,
    companyLogoUrl: String,
    location: String,
    locationType: { type: String, enum: ['remote', 'hybrid', 'onsite'] },
    salaryMin: Number,
    salaryMax: Number,
    salaryCurrency: { type: String, default: 'USD' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
    },
    experienceRequired: String,
    requiredSkills: [String],
    preferredSkills: [String],
    responsibilities: [String],
    keywords: [String],
    industry: String,
    department: String,
    seniorityLevel: String,
    benefits: [String],
    techStack: [String],
    applicationDeadline: Date,
    postedDate: Date,
    isActive: { type: Boolean, default: true },
    isFavorited: { type: Boolean, default: false },
    notes: String,
    tags: [String],
  },
  { timestamps: true }
)

jobSchema.index({ userId: 1, title: 1 })
jobSchema.index({ userId: 1, company: 1 })
jobSchema.index({ userId: 1, createdAt: -1 })

export const JobModel: Model<IJobDocument> =
  mongoose.models.Job ?? mongoose.model<IJobDocument>('Job', jobSchema)
