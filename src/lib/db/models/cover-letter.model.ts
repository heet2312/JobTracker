import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface ICoverLetterDocument extends Document {
  userId: Types.ObjectId
  jobId: Types.ObjectId
  applicationId?: Types.ObjectId
  resumeId?: Types.ObjectId
  tone: 'professional' | 'startup' | 'enterprise' | 'faang' | 'remote'
  content: string
  subject: string
  wordCount: number
  version: number
  isActive: boolean
  generatedAt: Date
  editedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const coverLetterSchema = new Schema<ICoverLetterDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    tone: {
      type: String,
      enum: ['professional', 'startup', 'enterprise', 'faang', 'remote'],
      default: 'professional',
    },
    content: { type: String, default: '' },
    subject: { type: String, default: '' },
    wordCount: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    generatedAt: { type: Date, default: Date.now },
    editedAt: Date,
  },
  { timestamps: true }
)

export const CoverLetterModel: Model<ICoverLetterDocument> =
  mongoose.models.CoverLetter ??
  mongoose.model<ICoverLetterDocument>('CoverLetter', coverLetterSchema)
