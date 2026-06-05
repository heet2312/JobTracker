'use client'

import { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { MapPin, Calendar, ExternalLink } from 'lucide-react'
import { MatchScoreRing } from '@/components/ai/match-score-ring'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { daysSince, formatDate } from '@/lib/utils/date'
import { formatSalary, initials } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { IApplication } from '@/types'

interface KanbanCardProps {
  application: IApplication
}

export function KanbanCard({ application }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: application._id,
    data: { application },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const job = application.job
  const days = mounted ? daysSince(application.lastActivityDate) : 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all duration-150',
        isDragging && 'opacity-50 scale-95 shadow-xl border-primary/60'
      )}
    >
      {/* Company + Score */}
      <div className="flex items-start gap-2 mb-2">
        <Avatar className="h-7 w-7 shrink-0">
          <AvatarImage src={job?.companyLogoUrl} />
          <AvatarFallback className="text-[10px]">
            {initials(job?.company?.[0] ?? '?', job?.company?.[1] ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate leading-tight">{job?.title ?? 'Unknown Role'}</p>
          <p className="text-[10px] text-muted-foreground truncate">{job?.company}</p>
        </div>
        <MatchScoreRing score={0} size={28} strokeWidth={3} />
      </div>

      {/* Location + Salary */}
      {job?.location && (
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-2">
          <MapPin className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{job.location}</span>
          {job.locationType && (
            <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 ml-0.5">
              {job.locationType}
            </Badge>
          )}
        </div>
      )}

      {job?.salaryMin && (
        <p className="text-[10px] text-muted-foreground mb-2">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Calendar className="h-2.5 w-2.5" />
          <span>{days === 0 ? 'Today' : `${days}d ago`}</span>
        </div>
        <Link
          href={`/jobs/${application.job?._id ?? String(application.jobId)}`}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground" />
        </Link>
      </div>
    </div>
  )
}
