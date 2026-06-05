import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IResumeVersionDocument extends Document {
  resumeId: Types.ObjectId
  userId: Types.ObjectId
  jobId?: Types.ObjectId
  versionNumber: number
  content: string
  fullText: string
  changes: string[]
  atsScore?: number
  wordCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const resumeVersionSchema = new Schema<IResumeVersionDocument>(
  {
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    versionNumber: { type: Number, required: true },
    content: { type: String, default: '' },
    fullText: { type: String, default: '' },
    changes: [String],
    atsScore: Number,
    wordCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const ResumeVersionModel: Model<IResumeVersionDocument> =
  mongoose.models.ResumeVersion ??
  mongoose.model<IResumeVersionDocument>('ResumeVersion', resumeVersionSchema)
