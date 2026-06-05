'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { ResumeModel } from '@/lib/db/models/resume.model'
import { createResumeSchema } from '@/lib/validations/resume.schema'
import { countWords } from '@/lib/utils/format'
import { syncUser } from './user.actions'
import type { IResume, ActionResult } from '@/types'

export async function createResume(data: unknown): Promise<ActionResult<IResume>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const parsed = createResumeSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.message }
    await connectDB()
    const userId = await syncUser()
    if (parsed.data.isMaster) {
      await ResumeModel.updateMany({ userId }, { isMaster: false })
    }
    const resume = await ResumeModel.create({
      ...parsed.data,
      userId,
      wordCount: countWords(parsed.data.content),
    })
    return { success: true, data: JSON.parse(JSON.stringify(resume)) as IResume }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getResumes(): Promise<ActionResult<IResume[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const resumes = await ResumeModel.find({ userId, isActive: true }).sort({ updatedAt: -1 }).lean()
    return { success: true, data: JSON.parse(JSON.stringify(resumes)) as IResume[] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function setMasterResume(resumeId: string): Promise<ActionResult<IResume>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    await ResumeModel.updateMany({ userId }, { isMaster: false })
    const resume = await ResumeModel.findOneAndUpdate(
      { _id: resumeId, userId },
      { isMaster: true },
      { new: true }
    ).lean()
    if (!resume) return { success: false, error: 'Resume not found' }
    return { success: true, data: JSON.parse(JSON.stringify(resume)) as IResume }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function deleteResume(resumeId: string): Promise<ActionResult<void>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    await ResumeModel.findOneAndUpdate({ _id: resumeId, userId }, { isActive: false })
    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
