'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AIThinking } from '@/components/ai/ai-thinking'
import { CopyButton } from '@/components/shared/copy-button'
import { generateOutreachAction } from '@/lib/actions/ai.actions'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'
import type { IJob, IOutreachMessage } from '@/types'

interface OutreachTabProps {
  job: IJob
  existingMessages: IOutreachMessage[]
}

const TYPE_LABELS: Record<string, string> = {
  'recruiter-email': 'Recruiter Email',
  'hiring-manager-email': 'Hiring Manager Email',
  'linkedin-connect': 'LinkedIn Connect',
  'linkedin-followup': 'LinkedIn Follow-up',
  'cold-outreach': 'Cold Outreach',
}

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

export function OutreachTab({ job, existingMessages }: OutreachTabProps) {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<IOutreachMessage[]>(existingMessages)
  const { getKey } = useLocalApiKey()

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateOutreachAction(job._id, getKey() || undefined)
      if (result.success && result.data) {
        setMessages(result.data)
        toast.success('Outreach messages generated!')
      } else {
        toast.error(result.error ?? 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const generatedAt = messages[0]?.generatedAt

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {generatedAt && (
          <p className="text-xs text-muted-foreground">Generated {genDate(generatedAt)}</p>
        )}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          variant={messages.length > 0 ? 'outline' : 'default'}
          size={messages.length > 0 ? 'sm' : 'default'}
          className={messages.length === 0 ? 'mx-auto' : 'ml-auto'}
        >
          {loading ? 'Generating...' : messages.length > 0 ? 'Regenerate' : '✦ Generate Outreach Messages'}
        </Button>
      </div>

      {messages.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Generate 5 personalized outreach messages for {job.company}
          </p>
        </div>
      )}

      {loading && <AIThinking message="Crafting personalized outreach messages..." lines={4} />}

      {messages.length > 0 && (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{TYPE_LABELS[msg.type] ?? msg.type}</CardTitle>
                  <CopyButton text={`${msg.subject ? `Subject: ${msg.subject}\n\n` : ''}${msg.content}`} size="icon" />
                </div>
                {msg.subject && (
                  <p className="text-xs text-muted-foreground">Subject: {msg.subject}</p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/80">{msg.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
