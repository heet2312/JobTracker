import { formatDistanceToNow, format } from 'date-fns'
import { EmptyState } from '@/components/shared/empty-state'
import { getRecentActivities } from '@/lib/actions/activity.actions'
import {
  Activity,
  Download,
  Sparkles,
  FileText,
  Mail,
  Send,
  ClipboardCheck,
  ArrowRightLeft,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Trophy,
  PartyPopper,
  XCircle,
  StickyNote,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { IActivity } from '@/types'

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; bg: string; iconColor: string; label: string }> = {
  job_imported:            { icon: Download,       bg: 'bg-blue-500/15',    iconColor: 'text-blue-400',     label: 'Job Imported' },
  analysis_generated:     { icon: Sparkles,        bg: 'bg-purple-500/15',  iconColor: 'text-purple-400',   label: 'Analysis Generated' },
  resume_generated:       { icon: FileText,        bg: 'bg-indigo-500/15',  iconColor: 'text-indigo-400',   label: 'Resume Generated' },
  cover_letter_generated: { icon: Mail,            bg: 'bg-violet-500/15',  iconColor: 'text-violet-400',   label: 'Cover Letter Generated' },
  outreach_created:       { icon: Send,            bg: 'bg-cyan-500/15',    iconColor: 'text-cyan-400',     label: 'Outreach Created' },
  application_submitted:  { icon: ClipboardCheck,  bg: 'bg-green-500/15',   iconColor: 'text-green-400',    label: 'Application Submitted' },
  stage_changed:          { icon: ArrowRightLeft,  bg: 'bg-yellow-500/15',  iconColor: 'text-yellow-400',   label: 'Stage Changed' },
  followup_sent:          { icon: Bell,            bg: 'bg-orange-500/15',  iconColor: 'text-orange-400',   label: 'Follow-up Generated' },
  interview_scheduled:    { icon: CalendarCheck,   bg: 'bg-pink-500/15',    iconColor: 'text-pink-400',     label: 'Interview Prep Generated' },
  interview_completed:    { icon: CheckCircle2,    bg: 'bg-teal-500/15',    iconColor: 'text-teal-400',     label: 'Interview Completed' },
  offer_received:         { icon: Trophy,          bg: 'bg-emerald-500/15', iconColor: 'text-emerald-400',  label: 'Offer Received' },
  offer_accepted:         { icon: PartyPopper,     bg: 'bg-emerald-500/15', iconColor: 'text-emerald-400',  label: 'Offer Accepted' },
  rejected:               { icon: XCircle,         bg: 'bg-red-500/15',     iconColor: 'text-red-400',      label: 'Rejected' },
  note_added:             { icon: StickyNote,      bg: 'bg-zinc-500/15',    iconColor: 'text-zinc-400',     label: 'Note Added' },
}

const DEFAULT_CONFIG = { icon: StickyNote, bg: 'bg-zinc-500/15', iconColor: 'text-zinc-400', label: 'Activity' }

function groupByDate(activities: IActivity[]): Array<{ date: string; items: IActivity[] }> {
  const groups: Record<string, IActivity[]> = {}
  for (const activity of activities) {
    const key = format(new Date(activity.createdAt), 'MMMM d, yyyy')
    if (!groups[key]) groups[key] = []
    groups[key].push(activity)
  }
  return Object.entries(groups).map(([date, items]) => ({ date, items }))
}

export default async function ActivityPage() {
  const result = await getRecentActivities(200)
  const activities = result.data ?? []
  const groups = groupByDate(activities)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Full history of your job search activity</p>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Your job search activity will appear here as you import jobs, run analyses, and make progress."
        />
      ) : (
        <div className="space-y-8">
          {groups.map(({ date, items }) => (
            <div key={date}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4 pl-[52px]">
                {date}
              </p>
              <div className="relative">
                <div className="absolute left-[19px] top-5 bottom-2 w-px bg-border/60" />
                <div className="space-y-1">
                  {items.map((activity) => {
                    const config = ACTIVITY_CONFIG[activity.type] ?? DEFAULT_CONFIG
                    const Icon = config.icon
                    return (
                      <div key={activity._id} className="flex gap-3 py-2.5">
                        <div className={cn('h-10 w-10 rounded-full shrink-0 flex items-center justify-center z-10', config.bg)}>
                          <Icon className={cn('h-4 w-4', config.iconColor)} />
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium leading-tight">{activity.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{config.label}</p>
                            </div>
                            <span className="text-[11px] text-muted-foreground/70 shrink-0 mt-px whitespace-nowrap">
                              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          {activity.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{activity.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
