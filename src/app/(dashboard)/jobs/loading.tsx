import { ListSkeleton } from '@/components/shared/loading-skeleton'

export default function JobsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-16 bg-muted rounded animate-pulse mb-1" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <ListSkeleton count={6} />
    </div>
  )
}
