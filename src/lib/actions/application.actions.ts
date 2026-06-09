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

    const eightWeeksAgo = subWeeks(new Date(), 8)

    // Use aggregation to avoid fetching all documents into JS memory
    const [stageCounts, avgScoreResult, weeklyAgg] = await Promise.all([
      // Count per stage + total in one query
      ApplicationModel.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: '$stage',
            count: { $sum: 1 },
            activeCount: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          },
        },
      ]),
      // Average match score
      AIAnalysisModel.aggregate([
        { $match: { userId } },
        { $group: { _id: null, avg: { $avg: '$overallScore' }, count: { $sum: 1 } } },
      ]),
      // Weekly application counts for the last 8 weeks
      ApplicationModel.aggregate([
        { $match: { userId, createdAt: { $gte: eightWeeksAgo } } },
        {
          $group: {
            _id: {
              year: { $isoWeekYear: '$createdAt' },
              week: { $isoWeek: '$createdAt' },
              stage: '$stage',
            },
            count: { $sum: 1 },
            minDate: { $min: '$createdAt' },
          },
        },
      ]),
    ])

    // Build stage → count map
    const stageMap: Record<string, number> = {}
    let totalApplications = 0
    let activeApplications = 0
    for (const row of stageCounts) {
      stageMap[row._id as string] = row.count as number
      totalApplications += row.count as number
      activeApplications += row.activeCount as number
    }

    const responded =
      (stageMap['screening'] ?? 0) +
      (stageMap['interview_1'] ?? 0) +
      (stageMap['interview_2'] ?? 0) +
      (stageMap['final'] ?? 0) +
      (stageMap['offer'] ?? 0) +
      (stageMap['accepted'] ?? 0) +
      (stageMap['rejected'] ?? 0)
    const interviewed =
      (stageMap['interview_1'] ?? 0) +
      (stageMap['interview_2'] ?? 0) +
      (stageMap['final'] ?? 0) +
      (stageMap['offer'] ?? 0) +
      (stageMap['accepted'] ?? 0)
    const offers = (stageMap['offer'] ?? 0) + (stageMap['accepted'] ?? 0)
    const rejected = stageMap['rejected'] ?? 0

    const responseRate = totalApplications ? Math.round((responded / totalApplications) * 100) : 0
    const interviewRate = totalApplications ? Math.round((interviewed / totalApplications) * 100) : 0
    const offerRate = totalApplications ? Math.round((offers / totalApplications) * 100) : 0
    const rejectionRate = totalApplications ? Math.round((rejected / totalApplications) * 100) : 0

    const avgMatchScore = avgScoreResult[0]
      ? Math.round(avgScoreResult[0].avg as number)
      : 0

    // Build weekly buckets from aggregation result
    const interviewStages = new Set(['interview_1', 'interview_2', 'final'])
    const offerStages = new Set(['offer', 'accepted'])

    const weeklyData = Array.from({ length: 8 }, (_, i) => {
      const weekStart = startOfWeek(subWeeks(new Date(), 7 - i))
      const isoYear = weekStart.getFullYear()
      // ISO week number
      const jan4 = new Date(isoYear, 0, 4)
      const isoWeek =
        Math.ceil(
          ((weekStart.getTime() - jan4.getTime()) / 86400000 +
            jan4.getDay() +
            1) /
            7
        )

      const rows = weeklyAgg.filter(
        (r) =>
          (r._id as Record<string, number>).year === isoYear &&
          (r._id as Record<string, number>).week === isoWeek
      )

      const applications = rows.reduce((s, r) => s + (r.count as number), 0)
      const interviews = rows
        .filter((r) => interviewStages.has((r._id as Record<string, string>).stage))
        .reduce((s, r) => s + (r.count as number), 0)
      const offersWeek = rows
        .filter((r) => offerStages.has((r._id as Record<string, string>).stage))
        .reduce((s, r) => s + (r.count as number), 0)

      return {
        week: format(weekStart, 'MMM d'),
        applications,
        interviews,
        offers: offersWeek,
      }
    })

    const funnelStages = ['applied', 'screening', 'interview_1', 'offer', 'accepted']
    const funnelData = funnelStages.map((stage) => ({
      stage,
      count: stageMap[stage] ?? 0,
      percentage: totalApplications
        ? Math.round(((stageMap[stage] ?? 0) / totalApplications) * 100)
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
