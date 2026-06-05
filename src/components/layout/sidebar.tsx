'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { LogOut, Search, Zap } from 'lucide-react'
import { SidebarNav } from './sidebar-nav'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCommandPalette } from '@/lib/hooks/use-command-palette'
import { initials } from '@/lib/utils/format'

export function Sidebar() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const { setOpen } = useCommandPalette()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4 border-b">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          AI Job Tracker
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left text-xs">Search...</span>
          <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>

      <Separator />

      {/* User */}
      <div className="flex items-center gap-3 p-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="text-xs">
            {user ? initials(user.firstName ?? '', user.lastName ?? '') : '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{user?.fullName ?? 'User'}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={() => signOut(() => router.push('/'))}
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </aside>
  )
}
