'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const PATH_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  board: 'Board',
  import: 'Import Job',
  jobs: 'Jobs',
  resumes: 'Resumes',
  discover: 'Discover',
  activity: 'Activity',
  settings: 'Settings',
}

export function Breadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm">
      {segments.map((segment, index) => {
        const label = PATH_LABELS[segment] ?? segment
        const href = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1

        return (
          <span key={segment} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
