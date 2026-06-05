import mongoose, { Document, Model, Schema, Types } from 'mongoose'

export interface IAIAnalysisDocument extends Document {
  userId: Types.ObjectId
  jobId: Types.ObjectId
  resumeId: Types.ObjectId
  overallScore: number
  skillsScore: number
  experienceScore: number
  atsScore: number
  keywordScore: number
  applicationProbability: number
  missingSkills: string[]
  missingKeywords: string[]
  matchedSkills: string[]
  matchedKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  scoreBreakdown: Map<string, number>
  generatedAt: Date
  aiModel: string
  createdAt: Date
  updatedAt: Date
}

const aiAnalysisSchema = new Schema<IAIAnalysisDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    overallScore: { type: Number, default: 0 },
    skillsScore: { type: Number, default: 0 },
    experienceScore: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    applicationProbability: { type: Number, default: 0 },
    missingSkills: [String],
    missingKeywords: [String],
    matchedSkills: [String],
    matchedKeywords: [String],
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    scoreBreakdown: { type: Map, of: Number },
    generatedAt: { type: Date, default: Date.now },
    aiModel: { type: String, default: '' },
  },
  { timestamps: true }
)

export const AIAnalysisModel: Model<IAIAnalysisDocument> =
  mongoose.models.AIAnalysis ??
  mongoose.model<IAIAnalysisDocument>('AIAnalysis', aiAnalysisSchema)
