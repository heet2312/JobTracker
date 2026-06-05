import { relativeTime } from '@/lib/utils/date'
import type { IActivity } from '@/types'

const ACTIVITY_ICONS: Record<string, string> = {
  job_imported: '📥',
  analysis_generated: '🧠',
  resume_generated: '📄',
  cover_letter_generated: '✉️',
  outreach_created: '📨',
  application_submitted: '🚀',
  stage_changed: '🔀',
  followup_sent: '📩',
  interview_scheduled: '📅',
  interview_completed: '✅',
  offer_received: '🎉',
  offer_accepted: '🎊',
  rejected: '❌',
  note_added: '📝',
}

interface RecentActivityFeedProps {
  activities: IActivity[]
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity._id} className="flex items-start gap-3">
          <span className="text-base mt-0.5">{ACTIVITY_ICONS[activity.type] ?? '•'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{activity.title}</p>
            {activity.description && (
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {relativeTime(activity.createdAt)}
          </span>
        </div>
      ))}
    </div>
  )
}
