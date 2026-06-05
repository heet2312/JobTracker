import mongoose, { Document, Model, Schema, Types } from 'mongoose'
import type { KanbanStage } from '@/types'

const KANBAN_STAGE_VALUES = [
  'saved', 'interested', 'applied', 'assessment', 'screening',
  'interview_1', 'interview_2', 'final', 'offer', 'accepted',
  'rejected', 'ghosted', 'withdrawn',
]

const stageHistorySchema = new Schema(
  {
    stage: { type: String, enum: KANBAN_STAGE_VALUES },
    date: { type: Date, default: Date.now },
    note: String,
  },
  { _id: false }
)

export interface IApplicationDocument extends Document {
  userId: Types.ObjectId
  jobId: Types.ObjectId
  resumeVersionId?: Types.ObjectId
  stage: KanbanStage
  status: 'active' | 'archived'
  appliedDate?: Date
  lastActivityDate?: Date
  applicationUrl?: string
  portalUsername?: string
  contactName?: string
  contactEmail?: string
  contactLinkedin?: string
  salaryExpectation?: number
  notes?: string
  priority: 'low' | 'medium' | 'high'
  boardPosition: number
  aiAnalysisId?: Types.ObjectId
  coverLetterId?: Types.ObjectId
  stageHistory: Array<{ stage: KanbanStage; date: Date; note?: string }>
  createdAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<IApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeVersionId: { type: Schema.Types.ObjectId, ref: 'ResumeVersion' },
    stage: {
      type: String,
      enum: KANBAN_STAGE_VALUES,
      default: 'saved',
      index: true,
    },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    appliedDate: Date,
    lastActivityDate: { type: Date, default: Date.now },
    applicationUrl: String,
    portalUsername: String,
    contactName: String,
    contactEmail: String,
    contactLinkedin: String,
    salaryExpectation: Number,
    notes: String,
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    boardPosition: { type: Number, default: 0 },
    aiAnalysisId: { type: Schema.Types.ObjectId, ref: 'AIAnalysis' },
    coverLetterId: { type: Schema.Types.ObjectId, ref: 'CoverLetter' },
    stageHistory: [stageHistorySchema],
  },
  { timestamps: true }
)

applicationSchema.index({ userId: 1, stage: 1 })
applicationSchema.index({ userId: 1, status: 1 })

export const ApplicationModel: Model<IApplicationDocument> =
  mongoose.models.Application ??
  mongoose.model<IApplicationDocument>('Application', applicationSchema)
