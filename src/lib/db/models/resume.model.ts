import mongoose, { Document, Model, Schema, Types } from 'mongoose'

const experienceItemSchema = new Schema(
  {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
    achievements: [String],
    location: String,
  },
  { _id: false }
)

const educationItemSchema = new Schema(
  {
    institution: String,
    degree: String,
    field: String,
    startDate: String,
    endDate: String,
    gpa: String,
    honors: String,
  },
  { _id: false }
)

const projectItemSchema = new Schema(
  {
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: String,
    endDate: String,
  },
  { _id: false }
)

const parsedDataSchema = new Schema(
  {
    summary: String,
    experience: [experienceItemSchema],
    education: [educationItemSchema],
    skills: [String],
    certifications: [String],
    projects: [projectItemSchema],
  },
  { _id: false }
)

export interface IResumeDocument extends Document {
  userId: Types.ObjectId
  name: string
  isMaster: boolean
  content: string
  fileUrl?: string
  fileKey?: string
  parsedData?: Record<string, unknown>
  wordCount: number
  versions: Types.ObjectId[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const resumeSchema = new Schema<IResumeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    isMaster: { type: Boolean, default: false },
    content: { type: String, default: '' },
    fileUrl: String,
    fileKey: String,
    parsedData: parsedDataSchema,
    wordCount: { type: Number, default: 0 },
    versions: [{ type: Schema.Types.ObjectId, ref: 'ResumeVersion' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

resumeSchema.index({ userId: 1, isMaster: 1 })

export const ResumeModel: Model<IResumeDocument> =
  mongoose.models.Resume ?? mongoose.model<IResumeDocument>('Resume', resumeSchema)
