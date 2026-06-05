import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICompanyDocument extends Document {
  name: string
  website?: string
  logoUrl?: string
  industry?: string
  size?: string
  description?: string
  linkedinUrl?: string
  createdAt: Date
  updatedAt: Date
}

const companySchema = new Schema<ICompanyDocument>(
  {
    name: { type: String, required: true, unique: true, index: true },
    website: String,
    logoUrl: String,
    industry: String,
    size: String,
    description: String,
    linkedinUrl: String,
  },
  { timestamps: true }
)

export const CompanyModel: Model<ICompanyDocument> =
  mongoose.models.Company ?? mongoose.model<ICompanyDocument>('Company', companySchema)
