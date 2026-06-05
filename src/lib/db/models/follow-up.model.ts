import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IFollowUpDocument extends Document {
  userId: Types.ObjectId
  applicationId: Types.ObjectId
  type: '3-day' | '7-day' | '14-day' | 'post-interview' | 'custom'
  scheduledDate?: Date
  sentDate?: Date
  status: 'pending' | 'sent' | 'responded' | 'skipped'
  channel: 'email' | 'linkedin' | 'phone'
  recipient?: string
  subject?: string
  content: string
  response?: string
  reminderSent: boolean
  createdAt: Date
  updatedAt: Date
}

const followUpSchema = new Schema<IFollowUpDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    type: {
      type: String,
      enum: ['3-day', '7-day', '14-day', 'post-interview', 'custom'],
      required: true,
    },
    scheduledDate: Date,
    sentDate: Date,
    status: {
      type: String,
      enum: ['pending', 'sent', 'responded', 'skipped'],
      default: 'pending',
    },
    channel: { type: String, enum: ['email', 'linkedin', 'phone'], default: 'email' },
    recipient: String,
    subject: String,
    content: { type: String, default: '' },
    response: String,
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
)

followUpSchema.index({ userId: 1, status: 1 })
followUpSchema.index({ userId: 1, scheduledDate: 1 })

export const FollowUpModel: Model<IFollowUpDocument> =
  mongoose.models.FollowUp ?? mongoose.model<IFollowUpDocument>('FollowUp', followUpSchema)
