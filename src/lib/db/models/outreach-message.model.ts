import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IOutreachMessageDocument extends Document {
  userId: Types.ObjectId
  jobId: Types.ObjectId
  type: 'recruiter-email' | 'hiring-manager-email' | 'linkedin-connect' | 'linkedin-followup' | 'cold-outreach'
  recipientName?: string
  recipientTitle?: string
  recipientCompany?: string
  subject?: string
  content: string
  generatedAt: Date
  copiedAt?: Date
  sentAt?: Date
  status: 'draft' | 'copied' | 'sent' | 'responded'
  createdAt: Date
  updatedAt: Date
}

const outreachMessageSchema = new Schema<IOutreachMessageDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    type: {
      type: String,
      enum: ['recruiter-email', 'hiring-manager-email', 'linkedin-connect', 'linkedin-followup', 'cold-outreach'],
      required: true,
    },
    recipientName: String,
    recipientTitle: String,
    recipientCompany: String,
    subject: String,
    content: { type: String, default: '' },
    generatedAt: { type: Date, default: Date.now },
    copiedAt: Date,
    sentAt: Date,
    status: {
      type: String,
      enum: ['draft', 'copied', 'sent', 'responded'],
      default: 'draft',
    },
  },
  { timestamps: true }
)

export const OutreachMessageModel: Model<IOutreachMessageDocument> =
  mongoose.models.OutreachMessage ??
  mongoose.model<IOutreachMessageDocument>('OutreachMessage', outreachMessageSchema)
