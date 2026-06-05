'use client'

import Link from 'next/link'
import { MapPin, Clock, Heart, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { relativeTime } from '@/lib/utils/date'
import { formatSalary } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { IJob } from '@/types'

interface JobCardProps {
  job: IJob
  onFavorite?: (id: string) => void
}

export function JobCard({ job, onFavorite }: JobCardProps) {
  return (
    <Card className="hover:border-primary/40 transition-colors group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0 rounded-lg">
            <AvatarImage src={job.companyLogoUrl} className="object-contain" />
            <AvatarFallback className="rounded-lg text-sm">
              <Building2 className="h-5 w-5 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${job._id}`} className="hover:underline">
              <p className="font-semibold text-sm truncate">{job.title}</p>
            </Link>
            <p className="text-sm text-muted-foreground truncate">{job.company}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0"
            onClick={() => onFavorite?.(job._id)}
          >
            <Heart
              className={cn('h-3.5 w-3.5', job.isFavorited && 'fill-destructive text-destructive')}
            />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.location && (
            <Badge variant="outline" className="text-xs gap-1 font-normal">
              <MapPin className="h-2.5 w-2.5" />
              {job.location}
            </Badge>
          )}
          {job.locationType && (
            <Badge variant="secondary" className="text-xs capitalize">{job.locationType}</Badge>
          )}
          {job.employmentType && (
            <Badge variant="outline" className="text-xs capitalize">{job.employmentType}</Badge>
          )}
        </div>
        {(job.salaryMin || job.salaryMax) && (
          <p className="text-xs text-muted-foreground mt-2">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </p>
        )}
        <div className="flex items-center gap-1 mt-2">
          <Clock className="h-2.5 w-2.5 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">{relativeTime(job.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
