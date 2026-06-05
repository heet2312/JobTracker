'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { ActivityModel } from '@/lib/db/models/activity.model'
import { syncUser } from './user.actions'
import type { ActivityType, IActivity, ActionResult } from '@/types'

export async function logActivity(params: {
  type: ActivityType
  title: string
  description?: string
  jobId?: string
  applicationId?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return
    await connectDB()
    const userId = await syncUser()
    await ActivityModel.create({
      userId,
      type: params.type,
      title: params.title,
      description: params.description ?? '',
      jobId: params.jobId,
      applicationId: params.applicationId,
      metadata: params.metadata,
    })
  } catch {
    // Activity logging is non-critical; swallow errors
  }
}

export async function getRecentActivities(limit = 20): Promise<ActionResult<IActivity[]>> {
  return getRecentActivity(limit)
}

export async function getRecentActivity(limit = 20): Promise<ActionResult<IActivity[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const activities = await ActivityModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
    return { success: true, data: JSON.parse(JSON.stringify(activities)) as IActivity[] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
