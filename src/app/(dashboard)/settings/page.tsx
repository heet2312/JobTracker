import { getUserSettings } from '@/lib/actions/user.actions'
import { SettingsClient } from './_components/settings-client'
import { AIProviderClient } from './_components/ai-provider-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Label } from '@/components/ui/label'
import type { AIProvider } from '@/lib/constants/ai-models'

export default async function SettingsPage() {
  const [user, settingsResult] = await Promise.all([
    currentUser(),
    getUserSettings(),
  ])

  const settings = settingsResult.data

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Your account information from Clerk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">Free plan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between dark and light mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* AI Provider — client component handles interactivity */}
      <AIProviderClient
        initialProvider={(settings?.aiProvider ?? 'gemini') as AIProvider}
        initialModel={settings?.aiModel ?? ''}
        initialKeyIsSet={Boolean(settings?.aiApiKey)}
      />

      {/* Notifications — client component handles interactivity */}
      <SettingsClient
        initialEmailNotifications={settings?.emailNotifications ?? true}
        initialFollowUpReminders={settings?.followUpReminders ?? true}
        initialWeeklyDigest={settings?.weeklyDigest ?? false}
      />

      {/* AI Models */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Models</CardTitle>
          <CardDescription>Google Gemini models used for AI features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Fast operations</p>
              <p className="text-xs text-muted-foreground">Job parsing, outreach, follow-ups</p>
            </div>
            <Badge variant="secondary">Gemini 2.5 Flash</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Deep analysis</p>
              <p className="text-xs text-muted-foreground">Match scoring, resume optimization, interview prep</p>
            </div>
            <Badge variant="secondary">Gemini 2.5 Pro</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
