import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IJobRecommendationDocument extends Document {
  userId: Types.ObjectId
  title: string
  company: string
  location: string
  estimatedSalary: string
  matchScore: number
  matchReason: string
  missingSkills: string[]
  priorityScore: number
  whyApply: string
  searchQuery: string
  savedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const jobRecommendationSchema = new Schema<IJobRecommendationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    estimatedSalary: { type: String, default: '' },
    matchScore: { type: Number, default: 0 },
    matchReason: { type: String, default: '' },
    missingSkills: [String],
    priorityScore: { type: Number, default: 0 },
    whyApply: { type: String, default: '' },
    searchQuery: { type: String, default: '' },
    savedAt: Date,
  },
  { timestamps: true }
)

export const JobRecommendationModel: Model<IJobRecommendationDocument> =
  mongoose.models.JobRecommendation ??
  mongoose.model<IJobRecommendationDocument>('JobRecommendation', jobRecommendationSchema)
