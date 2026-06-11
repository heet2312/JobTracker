'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { updateUserSettings } from '@/lib/actions/user.actions'

interface SettingsClientProps {
  initialEmailNotifications: boolean
  initialFollowUpReminders: boolean
  initialWeeklyDigest: boolean
}

function ComingSoon() {
  return (
    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[10px] font-medium px-1.5 py-0">
      Email delivery coming soon
    </Badge>
  )
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
          Configure your notification preferences. Email delivery is coming soon — your settings will be applied automatically when it launches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Label>Email Notifications</Label>
              <ComingSoon />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Receive email reminders and updates</p>
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
            <div className="flex items-center gap-2 flex-wrap">
              <Label>Follow-up Reminders</Label>
              <ComingSoon />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Get reminded to follow up on applications</p>
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
            <div className="flex items-center gap-2 flex-wrap">
              <Label>Weekly Digest</Label>
              <ComingSoon />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Weekly summary of your job search progress</p>
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
