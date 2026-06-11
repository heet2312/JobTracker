'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { JobModel } from '@/lib/db/models/job.model'
import { createJobSchema, updateJobSchema } from '@/lib/validations/job.schema'
import { parseJobDescription, parseJobFromUrl } from '@/lib/ai/services/job-parser.service'
import { getUserAIClients } from '@/lib/ai/get-user-ai-client'
import { logActivity } from './activity.actions'
import { syncUser } from './user.actions'
import type { IJob, ParsedJob, JobFilters, ActionResult } from '@/types'

export async function createJob(data: unknown): Promise<ActionResult<IJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const parsed = createJobSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.message }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.create({ ...parsed.data, userId })
    await logActivity({
      type: 'job_imported',
      title: `Imported "${parsed.data.title}" at ${parsed.data.company}`,
      jobId: String(job._id),
    })
    return { success: true, data: JSON.parse(JSON.stringify(job)) as IJob }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateJob(jobId: string, data: unknown): Promise<ActionResult<IJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const parsed = updateJobSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.message }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.findOneAndUpdate(
      { _id: jobId, userId },
      { $set: parsed.data },
      { new: true }
    ).lean()
    if (!job) return { success: false, error: 'Job not found' }
    return { success: true, data: JSON.parse(JSON.stringify(job)) as IJob }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteJob(jobId: string): Promise<ActionResult<void>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    await JobModel.findOneAndDelete({ _id: jobId, userId })
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getJobs(filters?: JobFilters): Promise<ActionResult<IJob[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const query: Record<string, unknown> = { userId }
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { company: { $regex: filters.search, $options: 'i' } },
      ]
    }
    if (filters?.locationType) query.locationType = filters.locationType
    if (filters?.employmentType) query.employmentType = filters.employmentType
    if (filters?.isFavorited !== undefined) query.isFavorited = filters.isFavorited
    if (filters?.industry) query.industry = filters.industry
    const jobs = await JobModel.find(query).sort({ createdAt: -1 }).lean()
    return { success: true, data: JSON.parse(JSON.stringify(jobs)) as IJob[] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getJobById(jobId: string): Promise<ActionResult<IJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.findOne({ _id: jobId, userId }).lean()
    if (!job) return { success: false, error: 'Job not found' }
    return { success: true, data: JSON.parse(JSON.stringify(job)) as IJob }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

function aiError(error: unknown): string {
  const msg = String(error)
  if (msg.includes('AI_KEY_REQUIRED')) return 'No API key configured. Go to Settings → AI Provider to add your key.'
  if (msg.includes('AI_MODEL_REQUIRED')) return 'No model selected. Go to Settings → AI Provider to choose a model.'
  return msg
}

export async function importJobFromUrl(url: string, clientApiKey?: string): Promise<ActionResult<ParsedJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const { fast } = await getUserAIClients(userId, clientApiKey)
    const parsed = await parseJobFromUrl(url, fast)
    return { success: true, data: parsed }
  } catch (error) {
    return { success: false, error: aiError(error) }
  }
}

export async function parseJobDescriptionAction(jd: string, clientApiKey?: string): Promise<ActionResult<ParsedJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const { fast } = await getUserAIClients(userId, clientApiKey)
    const parsed = await parseJobDescription(jd, fast)
    return { success: true, data: parsed }
  } catch (error) {
    return { success: false, error: aiError(error) }
  }
}

export async function parsePDFJobAction(base64: string, clientApiKey?: string): Promise<ActionResult<ParsedJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse = ((await import('pdf-parse')) as any).default ?? (await import('pdf-parse'))
    const buffer = Buffer.from(base64, 'base64')
    const pdfData = await pdfParse(buffer)
    const text = pdfData.text?.trim()
    if (!text || text.length < 50) return { success: false, error: 'Could not extract text from this PDF. Try copying the text and using the Paste JD tab instead.' }
    const { fast } = await getUserAIClients(userId, clientApiKey)
    const parsed = await parseJobDescription(text.slice(0, 20000), fast)
    return { success: true, data: parsed }
  } catch (error) {
    return { success: false, error: aiError(error) }
  }
}

export async function toggleFavoriteJob(jobId: string): Promise<ActionResult<IJob>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.findOne({ _id: jobId, userId }).lean()
    if (!job) return { success: false, error: 'Job not found' }
    const updated = await JobModel.findByIdAndUpdate(
      jobId,
      { isFavorited: !job.isFavorited },
      { new: true }
    ).lean()
    return { success: true, data: JSON.parse(JSON.stringify(updated)) as IJob }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
