'use client'

import { Bell } from 'lucide-react'
import { Breadcrumb } from './breadcrumb'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { UserButton } from '@clerk/nextjs'

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur">
      <div className="flex-1">
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled className="opacity-40 cursor-not-allowed">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Notifications — Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
