import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IProfileDocument extends Document {
  userId: Types.ObjectId
  headline?: string
  summary?: string
  targetRoles: string[]
  targetLocations: string[]
  targetSalaryMin?: number
  targetSalaryMax?: number
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any'
  experienceLevel?: 'intern' | 'junior' | 'mid' | 'senior' | 'staff' | 'principal' | 'executive'
  skills: string[]
  industries: string[]
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
  activeJobSearching: boolean
  createdAt: Date
  updatedAt: Date
}

const profileSchema = new Schema<IProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    headline: String,
    summary: String,
    targetRoles: [String],
    targetLocations: [String],
    targetSalaryMin: Number,
    targetSalaryMax: Number,
    remotePreference: {
      type: String,
      enum: ['remote', 'hybrid', 'onsite', 'any'],
      default: 'any',
    },
    experienceLevel: {
      type: String,
      enum: ['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'executive'],
    },
    skills: [String],
    industries: [String],
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String,
    activeJobSearching: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const ProfileModel: Model<IProfileDocument> =
  mongoose.models.Profile ?? mongoose.model<IProfileDocument>('Profile', profileSchema)
