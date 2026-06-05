import { formatDate } from '@/lib/utils/date'
import { Badge } from '@/components/ui/badge'
import type { IFollowUp } from '@/types'

interface PendingFollowupsProps {
  followups: IFollowUp[]
}

export function PendingFollowups({ followups }: PendingFollowupsProps) {
  if (followups.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">No pending follow-ups</p>
    )
  }

  return (
    <div className="space-y-2">
      {followups.map((fu) => (
        <div
          key={fu._id}
          className="flex items-center gap-3 rounded-lg border bg-card/50 px-3 py-2.5"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fu.subject ?? `${fu.type} follow-up`}</p>
            <p className="text-xs text-muted-foreground">
              {fu.scheduledDate ? formatDate(fu.scheduledDate) : 'No date set'}
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0">
            {fu.channel}
          </Badge>
        </div>
      ))}
    </div>
  )
}
