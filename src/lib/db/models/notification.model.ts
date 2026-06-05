import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface INotificationDocument extends Document {
  userId: Types.ObjectId
  type: string
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
  updatedAt: Date
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: String,
  },
  { timestamps: true }
)

notificationSchema.index({ userId: 1, read: 1 })
notificationSchema.index({ userId: 1, createdAt: -1 })

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification ??
  mongoose.model<INotificationDocument>('Notification', notificationSchema)
