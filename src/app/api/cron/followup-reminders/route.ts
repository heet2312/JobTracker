import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/connect'
import { FollowUpModel } from '@/lib/db/models/follow-up.model'
import { ApplicationModel } from '@/lib/db/models/application.model'
import { UserModel } from '@/lib/db/models/user.model'
import { SettingsModel } from '@/lib/db/models/settings.model'
import { JobModel } from '@/lib/db/models/job.model'
import { resend, FROM_ADDRESS } from '@/lib/email/resend'
import { followUpReminderHtml, followUpReminderText } from '@/lib/email/templates/followup-reminder'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aijobtracker.app'

export async function GET(req: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
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

  const now = new Date()

  // Find pending follow-ups whose scheduled date has passed and reminder hasn't been sent
  const dueFollowUps = await FollowUpModel.find({
    status: 'pending',
    reminderSent: false,
    scheduledDate: { $lte: now },
  }).lean()

  if (dueFollowUps.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  // Collect unique userIds to batch-check their settings
  const userIds = [...new Set(dueFollowUps.map((f) => String(f.userId)))]

  const [users, settingsArr] = await Promise.all([
    UserModel.find({ _id: { $in: userIds } }, 'firstName email').lean(),
    SettingsModel.find({ userId: { $in: userIds } }, 'userId followUpReminders').lean(),
  ])

  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]))
  const settingsMap = Object.fromEntries(settingsArr.map((s) => [String(s.userId), s]))

  let sent = 0

  for (const followUp of dueFollowUps) {
    const userId = String(followUp.userId)
    const settings = settingsMap[userId]
    if (!settings?.followUpReminders) continue

    const user = userMap[userId]
    if (!user?.email) continue

    // Fetch the application + job for context
    const application = await ApplicationModel.findById(followUp.applicationId).lean()
    if (!application) continue
    const job = await JobModel.findById(application.jobId, 'title company').lean()
    if (!job) continue

    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: user.email,
        subject: `Follow-up reminder: ${job.title} at ${job.company}`,
        html: followUpReminderHtml({
          firstName: user.firstName || 'there',
          jobTitle: job.title,
          company: job.company,
          followUpType: followUp.type,
          subject: followUp.subject ?? '',
          content: followUp.content,
          appUrl: APP_URL,
        }),
        text: followUpReminderText({
          firstName: user.firstName || 'there',
          jobTitle: job.title,
          company: job.company,
          followUpType: followUp.type,
          subject: followUp.subject ?? '',
          content: followUp.content,
          appUrl: APP_URL,
        }),
      })

      await FollowUpModel.findByIdAndUpdate(followUp._id, { reminderSent: true })
      sent++
    } catch (err) {
      console.error(`[cron/followup-reminders] Failed to send for followUp ${followUp._id}:`, err)
    }
  }

  return NextResponse.json({ sent, checked: dueFollowUps.length })
}
