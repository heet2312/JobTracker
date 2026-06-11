'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AIThinking } from '@/components/ai/ai-thinking'
import { CopyButton } from '@/components/shared/copy-button'
import { generateFollowUpAction } from '@/lib/actions/ai.actions'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'
import type { IJob, IFollowUp, FollowUpType } from '@/types'

interface FollowupsTabProps {
  job: IJob
  applicationId?: string
  existingFollowUps: IFollowUp[]
}

const FOLLOWUP_TYPES: { value: FollowUpType; label: string }[] = [
  { value: '3-day', label: '3-day follow-up' },
  { value: '7-day', label: '7-day follow-up' },
  { value: '14-day', label: '14-day follow-up' },
  { value: 'post-interview', label: 'Post-interview thank you' },
  { value: 'custom', label: 'Custom' },
]

const TYPE_LABELS: Record<FollowUpType, string> = {
  '3-day': '3-day',
  '7-day': '7-day',
  '14-day': '14-day',
  'post-interview': 'Post-interview',
  'custom': 'Custom',
}

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

export function FollowupsTab({ job, applicationId, existingFollowUps }: FollowupsTabProps) {
  const [type, setType] = useState<FollowUpType>('7-day')
  const [loading, setLoading] = useState(false)
  const [followUps, setFollowUps] = useState<IFollowUp[]>(existingFollowUps)
  const { getKey } = useLocalApiKey()

  async function handleGenerate() {
    if (!applicationId) {
      toast.error('Please create an application for this job first')
      return
    }
    setLoading(true)
    try {
      const result = await generateFollowUpAction(applicationId, type, getKey() || undefined)
      if (result.success && result.data) {
        setFollowUps((prev) => [result.data!, ...prev])
        toast.success('Follow-up generated!')
      } else {
        toast.error(result.error ?? 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={type} onValueChange={(v) => setType(v as FollowUpType)}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FOLLOWUP_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={loading || !applicationId}>
          {loading ? 'Generating...' : '✦ Generate Follow-Up'}
        </Button>
      </div>

      {!applicationId && (
        <p className="text-xs text-muted-foreground">
          Add this job to your board first to generate follow-ups.
        </p>
      )}

      {loading && <AIThinking message="Writing your follow-up message..." lines={5} />}

      {followUps.length === 0 && !loading && applicationId && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No follow-ups yet. Generate your first one above.</p>
        </div>
      )}

      {followUps.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} generated</p>
          {followUps.map((fu) => (
            <Card key={fu._id}>
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{TYPE_LABELS[fu.type]}</Badge>
                    <Badge
                      variant="secondary"
                      className={
                        fu.status === 'sent' ? 'bg-blue-500/10 text-blue-500' :
                        fu.status === 'responded' ? 'bg-green-500/10 text-green-500' :
                        ''
                      }
                    >
                      {fu.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{genDate(fu.createdAt)}</span>
                    <CopyButton text={`Subject: ${fu.subject}\n\n${fu.content}`} size="icon" />
                  </div>
                </div>
                <p className="text-sm font-medium">{fu.subject}</p>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80">
                  {fu.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
