import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { UserModel } from '@/lib/db/models/user.model'
import { SettingsModel } from '@/lib/db/models/settings.model'
import { ApplicationModel } from '@/lib/db/models/application.model'
import { FollowUpModel } from '@/lib/db/models/follow-up.model'
import { resend, FROM_ADDRESS } from '@/lib/email/resend'
import { weeklyDigestHtml, weeklyDigestText } from '@/lib/email/templates/weekly-digest'
import { format } from 'date-fns'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aijobtracker.app'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: true, reason: 'RESEND_API_KEY not configured' })
  }

  await connectDB()

  // Find all users who want the weekly digest
  const digestSettings = await SettingsModel.find({ weeklyDigest: true }, 'userId').lean()
  if (digestSettings.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  const userIds = digestSettings.map((s) => s.userId)
  const users = await UserModel.find({ _id: { $in: userIds } }, 'firstName email').lean()
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]))

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const weekStart = format(weekAgo, 'MMM d')
  const weekEnd = format(now, 'MMM d, yyyy')

  let sent = 0

  for (const setting of digestSettings) {
    const userId = setting.userId
    const user = userMap[String(userId)]
    if (!user?.email) continue

    try {
      const [allApps, newApps, pendingFollowUps] = await Promise.all([
        ApplicationModel.find({ userId, status: 'active' }).lean(),
        ApplicationModel.find({ userId, createdAt: { $gte: weekAgo } }).lean(),
        FollowUpModel.countDocuments({ userId, status: 'pending' }),
      ])

      // Count stage changes this week using stageHistory
      let stageChanges = 0
      for (const app of allApps) {
        for (const h of app.stageHistory) {
          if (new Date(h.date) >= weekAgo) stageChanges++
        }
      }

      // Count by stage
      const stageCounts: Record<string, number> = {}
      for (const app of allApps) {
        stageCounts[app.stage] = (stageCounts[app.stage] ?? 0) + 1
      }
      const topStages = Object.entries(stageCounts)
        .map(([stage, count]) => ({ stage, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)

      const digestData = {
        firstName: user.firstName || 'there',
        weekStart,
        weekEnd,
        totalApplications: allApps.length,
        newThisWeek: newApps.length,
        activeApplications: allApps.filter((a) =>
          !['rejected', 'ghosted', 'withdrawn', 'accepted'].includes(a.stage)
        ).length,
        pendingFollowUps,
        stageChanges,
        topStages,
        appUrl: APP_URL,
      }

      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: `Your job search digest — ${weekStart}–${weekEnd}`,
        html: weeklyDigestHtml(digestData),
        text: weeklyDigestText(digestData),
      })

      sent++
    } catch (err) {
      console.error(`[cron/weekly-digest] Failed to send for user ${userId}:`, err)
    }
  }

  return NextResponse.json({ sent, total: digestSettings.length })
}
