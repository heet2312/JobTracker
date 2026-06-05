'use client'

import { formatDistanceToNow } from 'date-fns'
import {
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

interface ActivityTabProps {
  activities: IActivity[]
}

const ACTIVITY_CONFIG: Record<string, { icon: React.ElementType; bg: string; iconColor: string }> = {
  job_imported:            { icon: Download,       bg: 'bg-blue-500/15',    iconColor: 'text-blue-400' },
  analysis_generated:     { icon: Sparkles,        bg: 'bg-purple-500/15',  iconColor: 'text-purple-400' },
  resume_generated:       { icon: FileText,        bg: 'bg-indigo-500/15',  iconColor: 'text-indigo-400' },
  cover_letter_generated: { icon: Mail,            bg: 'bg-violet-500/15',  iconColor: 'text-violet-400' },
  outreach_created:       { icon: Send,            bg: 'bg-cyan-500/15',    iconColor: 'text-cyan-400' },
  application_submitted:  { icon: ClipboardCheck,  bg: 'bg-green-500/15',   iconColor: 'text-green-400' },
  stage_changed:          { icon: ArrowRightLeft,  bg: 'bg-yellow-500/15',  iconColor: 'text-yellow-400' },
  followup_sent:          { icon: Bell,            bg: 'bg-orange-500/15',  iconColor: 'text-orange-400' },
  interview_scheduled:    { icon: CalendarCheck,   bg: 'bg-pink-500/15',    iconColor: 'text-pink-400' },
  interview_completed:    { icon: CheckCircle2,    bg: 'bg-teal-500/15',    iconColor: 'text-teal-400' },
  offer_received:         { icon: Trophy,          bg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
  offer_accepted:         { icon: PartyPopper,     bg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
  rejected:               { icon: XCircle,         bg: 'bg-red-500/15',     iconColor: 'text-red-400' },
  note_added:             { icon: StickyNote,      bg: 'bg-zinc-500/15',    iconColor: 'text-zinc-400' },
}

const DEFAULT_CONFIG = { icon: StickyNote, bg: 'bg-zinc-500/15', iconColor: 'text-zinc-400' }

export function ActivityTab({ activities }: ActivityTabProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <ClipboardCheck className="h-5 w-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Actions on this job will appear here</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-6 bottom-2 w-px bg-border/60" />

      <div className="space-y-1">
        {activities.map((activity, idx) => {
          const config = ACTIVITY_CONFIG[activity.type] ?? DEFAULT_CONFIG
          const Icon = config.icon

          return (
            <div key={activity._id} className="flex gap-3 py-2.5 group">
              {/* Icon circle */}
              <div className={cn('h-10 w-10 rounded-full shrink-0 flex items-center justify-center z-10', config.bg)}>
                <Icon className={cn('h-4 w-4', config.iconColor)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-tight">{activity.title}</p>
                  <span className="text-[11px] text-muted-foreground/70 shrink-0 mt-px">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {activity.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{activity.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
