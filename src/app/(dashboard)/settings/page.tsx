'use client'

import { useUser } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

function ComingSoon() {
  return (
    <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[10px] font-medium px-1.5 py-0">
      Coming soon
    </Badge>
  )
}

export default function SettingsPage() {
  const { user } = useUser()

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
              <p className="font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
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

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Email Notifications</Label>
                <ComingSoon />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Receive email reminders and updates</p>
            </div>
            <Switch disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Follow-up Reminders</Label>
                <ComingSoon />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Get reminded to follow up on applications</p>
            </div>
            <Switch disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Weekly Digest</Label>
                <ComingSoon />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Weekly summary of your job search progress</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

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
