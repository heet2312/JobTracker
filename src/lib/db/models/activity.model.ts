import mongoose, { Document, Model, Schema, Types } from 'mongoose'

const ACTIVITY_TYPES = [
  'job_imported',
  'analysis_generated',
  'resume_generated',
  'cover_letter_generated',
  'outreach_created',
  'application_submitted',
  'stage_changed',
  'followup_sent',
  'interview_scheduled',
  'interview_completed',
  'offer_received',
  'offer_accepted',
  'rejected',
  'note_added',
]

export interface IActivityDocument extends Document {
  userId: Types.ObjectId
  jobId?: Types.ObjectId
  applicationId?: Types.ObjectId
  type: string
  title: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

const activitySchema = new Schema<IActivityDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
    type: { type: String, enum: ACTIVITY_TYPES, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

activitySchema.index({ userId: 1, createdAt: -1 })

export const ActivityModel: Model<IActivityDocument> =
  mongoose.models.Activity ?? mongoose.model<IActivityDocument>('Activity', activitySchema)
