import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IInterviewDocument extends Document {
  userId: Types.ObjectId
  applicationId: Types.ObjectId
  scheduledAt?: Date
  platform?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  notes?: string
  outcome?: 'pass' | 'fail' | 'pending'
  createdAt: Date
  updatedAt: Date
}

const interviewSchema = new Schema<IInterviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    scheduledAt: Date,
    platform: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    notes: String,
    outcome: { type: String, enum: ['pass', 'fail', 'pending'] },
  },
  { timestamps: true }
)

export const InterviewModel: Model<IInterviewDocument> =
  mongoose.models.Interview ?? mongoose.model<IInterviewDocument>('Interview', interviewSchema)
