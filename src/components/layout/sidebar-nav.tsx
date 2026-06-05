'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Kanban, Plus, Briefcase, FileText, Compass, Activity, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.BOARD, label: 'Board', icon: Kanban },
  { href: ROUTES.IMPORT, label: 'Import Job', icon: Plus },
  { href: ROUTES.JOBS, label: 'Jobs', icon: Briefcase },
  { href: ROUTES.RESUMES, label: 'Resumes', icon: FileText },
  { href: ROUTES.DISCOVER, label: 'Discover', icon: Compass },
  { href: ROUTES.ACTIVITY, label: 'Activity', icon: Activity },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
