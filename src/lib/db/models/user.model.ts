import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUserDocument extends Document {
  clerkId: string
  email: string
  firstName: string
  lastName: string
  imageUrl: string
  onboardingComplete: boolean
  plan: 'free' | 'pro'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true, default: '' },
    lastName: { type: String, required: true, default: '' },
    imageUrl: { type: String, default: '' },
    onboardingComplete: { type: Boolean, default: false },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  },
  { timestamps: true }
)

export const UserModel: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model<IUserDocument>('User', userSchema)
