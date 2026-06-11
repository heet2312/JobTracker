import { JobList } from '@/components/jobs/job-list'

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground text-sm mt-1">All imported and tracked job postings</p>
      </div>
      <div data-tour="jobs-content">
        <JobList />
      </div>
    </div>
  )
}
