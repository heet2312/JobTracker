'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { ApplicationModel } from '@/lib/db/models/application.model'
import { AIAnalysisModel } from '@/lib/db/models/ai-analysis.model'
import { ActivityModel } from '@/lib/db/models/activity.model'
import { createApplicationSchema } from '@/lib/validations/application.schema'
import { logActivity } from './activity.actions'
import { syncUser } from './user.actions'
import type { IApplication, KanbanStage, DashboardStats, IActivity, ActionResult } from '@/types'
import { KANBAN_STAGES } from '@/lib/constants/kanban-stages'
import { startOfWeek, subWeeks, format } from 'date-fns'

export async function createApplication(data: unknown): Promise<ActionResult<IApplication>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    const parsed = createApplicationSchema.safeParse(data)
    if (!parsed.success) return { success: false, error: parsed.error.message }
    await connectDB()
    const userId = await syncUser()
    const countInStage = await ApplicationModel.countDocuments({
      userId,
      stage: parsed.data.stage,
    })
    const application = await ApplicationModel.create({
      ...parsed.data,
      userId,
      boardPosition: countInStage,
      stageHistory: [{ stage: parsed.data.stage, date: new Date() }],
      lastActivityDate: new Date(),
    })
    await logActivity({
      type: 'application_submitted',
      title: 'Application created',
      applicationId: String(application._id),
      jobId: parsed.data.jobId,
    })
    return { success: true, data: JSON.parse(JSON.stringify(application)) as IApplication }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function updateApplicationStage(
  applicationId: string,
  stage: KanbanStage,
  position: number
): Promise<ActionResult<IApplication>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const application = await ApplicationModel.findOneAndUpdate(
      { _id: applicationId, userId },
      {
        $set: { stage, boardPosition: position, lastActivityDate: new Date() },
        $push: { stageHistory: { stage, date: new Date() } },
      },
      { new: true }
    ).lean()
    if (!application) return { success: false, error: 'Application not found' }
    await logActivity({
      type: 'stage_changed',
      title: `Moved to ${stage}`,
      applicationId,
    })
    return { success: true, data: JSON.parse(JSON.stringify(application)) as IApplication }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getApplicationsByStage(): Promise<ActionResult<Record<KanbanStage, IApplication[]>>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const applications = await ApplicationModel.find({ userId, status: 'active' })
      .populate('jobId', 'title company companyLogoUrl location locationType salaryMin salaryMax salaryCurrency')
      .sort({ boardPosition: 1 })
      .lean()

    const grouped = Object.fromEntries(
      KANBAN_STAGES.map((s) => [s.id, []])
    ) as unknown as Record<KanbanStage, IApplication[]>

    for (const app of applications) {
      const stage = app.stage as KanbanStage
      if (grouped[stage]) {
        // Mongoose populate replaces jobId (string) with the full job object in-place.
        // Split it back so jobId is a string and job holds the populated data.
        const raw = JSON.parse(JSON.stringify(app)) as Record<string, unknown>
        if (raw.jobId && typeof raw.jobId === 'object') {
          raw.job = raw.jobId
          raw.jobId = (raw.jobId as { _id: string })._id
        }
        grouped[stage].push(raw as unknown as IApplication)
      }
    }
    return { success: true, data: grouped }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getApplicationForJob(jobId: string): Promise<ActionResult<IApplication>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const application = await ApplicationModel.findOne({ userId, jobId }).lean()
    if (!application) return { success: true, data: undefined }
    return { success: true, data: JSON.parse(JSON.stringify(application)) as IApplication }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getActivitiesForJob(jobId: string): Promise<ActionResult<IActivity[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const activities = await ActivityModel.find({ userId, jobId }).sort({ createdAt: -1 }).limit(50).lean()
    return { success: true, data: JSON.parse(JSON.stringify(activities)) as IActivity[] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()

    const [totalApplications, activeApplications, allApplications, analyses] = await Promise.all([
      ApplicationModel.countDocuments({ userId }),
      ApplicationModel.countDocuments({ userId, status: 'active' }),
      ApplicationModel.find({ userId }).lean(),
      AIAnalysisModel.find({ userId }).lean(),
    ])

    const responded = allApplications.filter((a) =>
      ['screening', 'interview_1', 'interview_2', 'final', 'offer', 'accepted', 'rejected'].includes(a.stage)
    ).length
    const interviewed = allApplications.filter((a) =>
      ['interview_1', 'interview_2', 'final', 'offer', 'accepted'].includes(a.stage)
    ).length
    const offers = allApplications.filter((a) => ['offer', 'accepted'].includes(a.stage)).length
    const rejected = allApplications.filter((a) => a.stage === 'rejected').length

    const responseRate = totalApplications ? Math.round((responded / totalApplications) * 100) : 0
    const interviewRate = totalApplications ? Math.round((interviewed / totalApplications) * 100) : 0
    const offerRate = totalApplications ? Math.round((offers / totalApplications) * 100) : 0
    const rejectionRate = totalApplications ? Math.round((rejected / totalApplications) * 100) : 0

    const avgMatchScore = analyses.length
      ? Math.round(analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / analyses.length)
      : 0

    const weeklyData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 7 - i))
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      const weekApps = allApplications.filter((a) => {
        const d = new Date(a.createdAt)
        return d >= weekStart && d < weekEnd
      })
      return {
        week: format(weekStart, 'MMM d'),
        applications: weekApps.length,
        interviews: weekApps.filter((a) =>
          ['interview_1', 'interview_2', 'final'].includes(a.stage)
        ).length,
        offers: weekApps.filter((a) => ['offer', 'accepted'].includes(a.stage)).length,
      }
    })

    const funnelStages = ['applied', 'screening', 'interview_1', 'offer', 'accepted']
    const funnelData = funnelStages.map((stage) => ({
      stage,
      count: allApplications.filter((a) => a.stage === stage).length,
      percentage: totalApplications
        ? Math.round(
            (allApplications.filter((a) => a.stage === stage).length / totalApplications) * 100
          )
        : 0,
    }))

    return {
      success: true,
      data: {
        totalApplications,
        activeApplications,
        responseRate,
        avgMatchScore,
        interviewRate,
        offerRate,
        rejectionRate,
        weeklyData,
        funnelData,
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
