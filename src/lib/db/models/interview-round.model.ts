import mongoose, { Document, Model, Schema, Types } from 'mongoose'

const questionItemSchema = new Schema(
  {
    question: String,
    category: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    hints: [String],
    sampleAnswer: String,
  },
  { _id: false }
)

export interface IInterviewRoundDocument extends Document {
  userId: Types.ObjectId
  applicationId: Types.ObjectId
  roundNumber: number
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral' | 'system-design' | 'case-study' | 'final'
  scheduledAt?: Date
  duration?: number
  interviewers: string[]
  platform?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  technicalQuestions: Array<Record<string, unknown>>
  behavioralQuestions: Array<Record<string, unknown>>
  companyQuestions: Array<Record<string, unknown>>
  systemDesignTopics: string[]
  notes?: string
  feedback?: string
  rating?: number
  outcome?: 'pass' | 'fail' | 'pending'
  isAIPrep: boolean
  readinessScore?: number
  prepPlan?: string[]
  createdAt: Date
  updatedAt: Date
}

const interviewRoundSchema = new Schema<IInterviewRoundDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    roundNumber: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical', 'behavioral', 'system-design', 'case-study', 'final'],
    },
    scheduledAt: Date,
    duration: Number,
    interviewers: [String],
    platform: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    technicalQuestions: [questionItemSchema],
    behavioralQuestions: [questionItemSchema],
    companyQuestions: [questionItemSchema],
    systemDesignTopics: [String],
    notes: String,
    feedback: String,
    rating: Number,
    outcome: { type: String, enum: ['pass', 'fail', 'pending'] },
    isAIPrep: { type: Boolean, default: false, index: true },
    readinessScore: Number,
    prepPlan: [String],
  },
  { timestamps: true }
)

export const InterviewRoundModel: Model<IInterviewRoundDocument> =
  mongoose.models.InterviewRound ??
  mongoose.model<IInterviewRoundDocument>('InterviewRound', interviewRoundSchema)
