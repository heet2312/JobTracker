import { Badge } from '@/components/ui/badge'
import { formatSalary } from '@/lib/utils/format'
import { formatDate } from '@/lib/utils/date'
import { MapPin, Building2, Calendar, DollarSign, Briefcase } from 'lucide-react'
import type { IJob, IApplication } from '@/types'

interface JobOverviewTabProps {
  job: IJob
  application?: IApplication | null
}

export function JobOverviewTab({ job }: JobOverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Key details */}
      <div className="grid grid-cols-2 gap-4">
        {job.location && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium">{job.location}</p>
            </div>
          </div>
        )}
        {job.company && (
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <p className="text-sm font-medium">{job.company}</p>
            </div>
          </div>
        )}
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Salary</p>
              <p className="text-sm font-medium">{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</p>
            </div>
          </div>
        )}
        {job.employmentType && (
          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Employment Type</p>
              <p className="text-sm font-medium capitalize">{job.employmentType}</p>
            </div>
          </div>
        )}
        {job.postedDate && (
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Posted</p>
              <p className="text-sm font-medium">{formatDate(job.postedDate)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {job.locationType && <Badge variant="secondary" className="capitalize">{job.locationType}</Badge>}
        {job.seniorityLevel && <Badge variant="outline">{job.seniorityLevel}</Badge>}
        {job.industry && <Badge variant="outline">{job.industry}</Badge>}
        {job.department && <Badge variant="outline">{job.department}</Badge>}
      </div>

      {/* Skills */}
      {job.requiredSkills?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((s) => (
              <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}
      {job.techStack?.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {job.techStack.map((s) => (
              <Badge key={s} className="text-xs bg-primary/10 text-primary border-primary/20">{s}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
