'use client'

import { Breadcrumb } from './breadcrumb'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { NotificationBell } from './notification-bell'
import { UserButton } from '@clerk/nextjs'

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur">
      <div className="flex-1">
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
