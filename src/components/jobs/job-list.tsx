'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Briefcase } from 'lucide-react'
import { JobCard } from './job-card'
import { JobFiltersBar } from './job-filters'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { ListSkeleton } from '@/components/shared/loading-skeleton'
import { Button } from '@/components/ui/button'
import { useJobs, useToggleFavorite } from '@/lib/hooks/use-jobs'
import type { JobFilters } from '@/types'

export function JobList() {
  const router = useRouter()
  const [filters, setFilters] = useState<JobFilters>({})
  const { data: jobs, isLoading, error, refetch } = useJobs(filters)
  const toggleFavorite = useToggleFavorite()

  if (isLoading) return <ListSkeleton count={6} />
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <JobFiltersBar filters={filters} onChange={setFilters} />
        <Button size="sm" className="shrink-0" onClick={() => router.push('/import')}>
          <Plus className="h-4 w-4 mr-1.5" />
          Import Job
        </Button>
      </div>

      {!jobs?.length ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Import your first job posting to get started"
          actionLabel="Import Job"
          onAction={() => router.push('/import')}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onFavorite={(id) => toggleFavorite.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
