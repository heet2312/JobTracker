import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface ISettingsDocument extends Document {
  userId: Types.ObjectId
  emailNotifications: boolean
  followUpReminders: boolean
  weeklyDigest: boolean
  theme: 'dark' | 'light' | 'system'
  defaultResumeId?: Types.ObjectId
  timezone: string
  aiProvider: 'gemini' | 'openai' | 'anthropic'
  aiModel: string
  createdAt: Date
  updatedAt: Date
}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    emailNotifications: { type: Boolean, default: true },
    followUpReminders: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: true },
    theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
    defaultResumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    timezone: { type: String, default: 'UTC' },
    aiProvider: { type: String, enum: ['gemini', 'openai', 'anthropic'], default: 'gemini' },
    aiModel: { type: String, default: '' },
  },
  { timestamps: true }
)

export const SettingsModel: Model<ISettingsDocument> =
  mongoose.models.Settings ?? mongoose.model<ISettingsDocument>('Settings', settingsSchema)
