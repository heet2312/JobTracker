'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { updateUserSettings } from '@/lib/actions/user.actions'

interface SettingsClientProps {
  initialEmailNotifications: boolean
  initialFollowUpReminders: boolean
  initialWeeklyDigest: boolean
}

export function SettingsClient({
  initialEmailNotifications,
  initialFollowUpReminders,
  initialWeeklyDigest,
}: SettingsClientProps) {
  const { user } = useUser()
  const [emailNotifications, setEmailNotifications] = useState(initialEmailNotifications)
  const [followUpReminders, setFollowUpReminders] = useState(initialFollowUpReminders)
  const [weeklyDigest, setWeeklyDigest] = useState(initialWeeklyDigest)
  const [isPending, startTransition] = useTransition()

  function replayTour() {
    if (user) localStorage.removeItem(`tour_done_${user.id}`)
    window.dispatchEvent(new Event('tour:replay'))
  }

  function handleToggle(
    key: 'emailNotifications' | 'followUpReminders' | 'weeklyDigest',
    value: boolean
  ) {
    const setters = {
      emailNotifications: setEmailNotifications,
      followUpReminders: setFollowUpReminders,
      weeklyDigest: setWeeklyDigest,
    }
    setters[key](value)

    startTransition(async () => {
      const result = await updateUserSettings({ [key]: value })
      if (result.success) {
        toast.success('Preference saved')
      } else {
        // Revert on failure
        setters[key](!value)
        toast.error('Failed to save preference')
      }
    })
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Onboarding</CardTitle>
        <CardDescription>Replay the getting-started tour at any time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="gap-2" onClick={replayTour}>
          <PlayCircle className="h-4 w-4" />
          Replay tour
        </Button>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Notifications</CardTitle>
        <CardDescription>
          Configure email notifications. Emails are sent daily at 9 AM UTC for reminders and every Monday for the weekly digest.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Master toggle — enables all email delivery</p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={(v) => handleToggle('emailNotifications', v)}
            disabled={isPending}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label>Follow-up Reminders</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Get reminded when a follow-up is due</p>
          </div>
          <Switch
            checked={followUpReminders}
            onCheckedChange={(v) => handleToggle('followUpReminders', v)}
            disabled={isPending}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label>Weekly Digest</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Monday morning summary of your job search</p>
          </div>
          <Switch
            checked={weeklyDigest}
            onCheckedChange={(v) => handleToggle('weeklyDigest', v)}
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
    </>
  )
}
