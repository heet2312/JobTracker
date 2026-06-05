'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Compass, ExternalLink, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { AIThinking } from '@/components/ai/ai-thinking'
import { MatchScoreRing } from '@/components/ai/match-score-ring'
import { EmptyState } from '@/components/shared/empty-state'
import { discoverJobsAction } from '@/lib/actions/ai.actions'
import type { JobRecommendation } from '@/types'

const schema = z.object({
  roles: z.string().min(1),
  skills: z.string().min(1),
  locations: z.string().optional(),
  remotePreference: z.enum(['remote', 'hybrid', 'onsite', 'any']),
  experienceLevel: z.enum(['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'executive']),
})

type FormData = z.infer<typeof schema>

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<JobRecommendation[]>([])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { remotePreference: 'any', experienceLevel: 'mid' },
  })

  async function onSubmit(data: FormData) {
    setLoading(true)
    setResults([])
    const result = await discoverJobsAction({
      targetRoles: data.roles.split(',').map((s) => s.trim()),
      skills: data.skills.split(',').map((s) => s.trim()),
      targetLocations: data.locations ? data.locations.split(',').map((s) => s.trim()) : [],
      remotePreference: data.remotePreference,
      experienceLevel: data.experienceLevel,
      industries: [],
    })
    setLoading(false)
    if (result.success && result.data) {
      setResults(result.data)
    } else {
      toast.error(result.error ?? 'Discovery failed')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered job recommendations based on your profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Target Roles</Label>
                <Input placeholder="e.g. Software Engineer, Frontend Developer" {...register('roles')} />
                {errors.roles && <p className="text-xs text-destructive">{errors.roles.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Key Skills</Label>
                <Input placeholder="e.g. React, TypeScript, Node.js" {...register('skills')} />
                {errors.skills && <p className="text-xs text-destructive">{errors.skills.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Preferred Locations (optional)</Label>
                <Input placeholder="e.g. San Francisco, New York, Remote" {...register('locations')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Remote Preference</Label>
                  <Select
                    value={watch('remotePreference')}
                    onValueChange={(v) => setValue('remotePreference', v as FormData['remotePreference'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Experience Level</Label>
                  <Select
                    value={watch('experienceLevel')}
                    onValueChange={(v) => setValue('experienceLevel', v as FormData['experienceLevel'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intern">Intern</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Discovering...' : '✦ Find Jobs with AI'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && <AIThinking message="Analyzing your profile and discovering opportunities..." lines={4} />}

      {!loading && results.length === 0 && (
        <EmptyState
          icon={Compass}
          title="Discover your next opportunity"
          description="Fill in your preferences above and let Gemini Pro find the best job matches for your profile."
        />
      )}

      {results.length > 0 && (
        <div className="grid gap-4">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {results.length} recommendations
          </p>
          {results.map((rec, i) => (
            <Card key={i} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <MatchScoreRing score={rec.matchScore} size={52} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{rec.title}</p>
                        <p className="text-sm text-muted-foreground">{rec.company} · {rec.location}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {rec.estimatedSalary}
                      </Badge>
                    </div>
                    <p className="text-sm mt-2 text-foreground/80">{rec.whyApply}</p>
                    {rec.missingSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Missing:</span>
                        {rec.missingSkills.map((s, j) => (
                          <Badge key={j} variant="outline" className="text-[10px] text-destructive border-destructive/30">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs text-muted-foreground">Priority</span>
                          <span className="text-xs">{rec.priorityScore}%</span>
                        </div>
                        <Progress value={rec.priorityScore} className="h-1" />
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(rec.searchQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />Search
                        </a>
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" disabled className="opacity-50 cursor-not-allowed">
                              <Lock className="h-3 w-3 mr-1" />Coming soon
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Auto-tracking from Discover — Coming soon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
