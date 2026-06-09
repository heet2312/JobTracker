'use client'

import { useState, useEffect, useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { Bell, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'
import { getRecentActivity } from '@/lib/actions/activity.actions'
import type { IActivity } from '@/types'

const STORAGE_KEY = 'last_notif_view_ts'

const TYPE_COLORS: Record<string, string> = {
  job_imported:            'bg-blue-500',
  analysis_generated:     'bg-purple-500',
  resume_generated:       'bg-indigo-500',
  cover_letter_generated: 'bg-violet-500',
  outreach_created:       'bg-cyan-500',
  application_submitted:  'bg-green-500',
  stage_changed:          'bg-yellow-500',
  followup_sent:          'bg-orange-500',
  interview_scheduled:    'bg-pink-500',
  interview_completed:    'bg-teal-500',
  offer_received:         'bg-emerald-500',
  offer_accepted:         'bg-emerald-600',
  rejected:               'bg-red-500',
  note_added:             'bg-zinc-500',
}

const TYPE_LABELS: Record<string, string> = {
  job_imported:            'Job Imported',
  analysis_generated:     'Match Analysis',
  resume_generated:       'Resume Optimized',
  cover_letter_generated: 'Cover Letter',
  outreach_created:       'Outreach Messages',
  application_submitted:  'Application',
  stage_changed:          'Stage Changed',
  followup_sent:          'Follow-up',
  interview_scheduled:    'Interview Prep',
  interview_completed:    'Interview',
  offer_received:         'Offer Received',
  offer_accepted:         'Offer Accepted',
  rejected:               'Rejected',
  note_added:             'Note',
}

function getLastViewedTs(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
}

function setLastViewedTs() {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, String(Date.now()))
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [activities, setActivities] = useState<IActivity[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [fetched, setFetched] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Calculate unread from cached activities on mount
  useEffect(() => {
    const lastTs = getLastViewedTs()
    // Show a dot if we've never viewed or it's been > 30 min
    const stale = Date.now() - lastTs > 30 * 60 * 1000
    if (stale) setUnreadCount(1) // minimum dot to draw attention
  }, [])

  function handleOpen(isOpen: boolean) {
    setOpen(isOpen)
    if (isOpen && !fetched) {
      startTransition(async () => {
        const result = await getRecentActivity(20)
        if (result.success && result.data) {
          setActivities(result.data)
          const lastTs = getLastViewedTs()
          const count = result.data.filter(
            (a) => new Date(a.createdAt).getTime() > lastTs
          ).length
          setUnreadCount(count)
          setFetched(true)
        }
      })
    }
    if (!isOpen && fetched) {
      setLastViewedTs()
      setUnreadCount(0)
    }
  }

  function markAllRead() {
    setLastViewedTs()
    setUnreadCount(0)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[380px] p-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-3 border-b flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-base font-semibold">Notifications</SheetTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllRead}
            >
              <Check className="h-3 w-3 mr-1" />Mark all read
            </Button>
          )}
        </SheetHeader>

        <ScrollArea className="flex-1">
          {isPending && (
            <div className="space-y-1 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 py-3 animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-muted mt-2 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-2.5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isPending && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Your job search activity will appear here
              </p>
            </div>
          )}

          {!isPending && activities.length > 0 && (
            <div className="py-2">
              {activities.map((activity) => {
                const lastTs = getLastViewedTs()
                const isUnread = fetched
                  ? new Date(activity.createdAt).getTime() > lastTs
                  : false

                return (
                  <div
                    key={activity._id}
                    className={cn(
                      'flex gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors',
                      isUnread && 'bg-primary/5'
                    )}
                  >
                    <div className="relative shrink-0 mt-1">
                      <div
                        className={cn(
                          'h-2 w-2 rounded-full mt-1',
                          TYPE_COLORS[activity.type] ?? 'bg-zinc-500'
                        )}
                      />
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm leading-snug', isUnread ? 'font-medium' : 'text-foreground/80')}>
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {TYPE_LABELS[activity.type] ?? activity.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
