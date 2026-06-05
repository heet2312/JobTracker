'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIThinking } from '@/components/ai/ai-thinking'
import { generateInterviewPrepAction } from '@/lib/actions/ai.actions'
import type { IJob, IStoredInterviewPrep, Question } from '@/types'

interface InterviewPrepTabProps {
  job: IJob
  applicationId?: string
  existingPrep: IStoredInterviewPrep | null
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
}

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

function QuestionCard({ q }: { q: Question }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium flex-1">{q.question}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${DIFFICULTY_COLOR[q.difficulty]}`}>
          {q.difficulty}
        </span>
      </div>
      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Hide answer' : 'Show sample answer'}
      </Button>
      {expanded && (
        <div className="space-y-1.5 pt-1 border-t border-border">
          <p className="text-xs text-foreground/80 leading-relaxed">{q.sampleAnswer}</p>
          {q.hints?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">Hints:</p>
              <ul className="space-y-0.5">
                {q.hints.map((h, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span>•</span><span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PrepView({ prep }: { prep: IStoredInterviewPrep }) {
  return (
    <div className="space-y-5">
      {prep.prepPlan?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Prep Plan</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-1.5">
              {prep.prepPlan.map((step, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-primary font-medium shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
      {prep.technicalQuestions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Technical Questions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {prep.technicalQuestions.map((q, i) => <QuestionCard key={i} q={q as Question} />)}
          </CardContent>
        </Card>
      )}
      {prep.behavioralQuestions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Behavioral Questions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {prep.behavioralQuestions.map((q, i) => <QuestionCard key={i} q={q as Question} />)}
          </CardContent>
        </Card>
      )}
      {prep.companyQuestions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Company-Specific Questions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {prep.companyQuestions.map((q, i) => <QuestionCard key={i} q={q as Question} />)}
          </CardContent>
        </Card>
      )}
      {prep.systemDesignTopics?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">System Design Topics</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {prep.systemDesignTopics.map((t, i) => (
              <Badge key={i} variant="secondary">{t}</Badge>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function InterviewPrepTab({ job, applicationId, existingPrep }: InterviewPrepTabProps) {
  const [loading, setLoading] = useState(false)
  const [prep, setPrep] = useState<IStoredInterviewPrep | null>(existingPrep)

  async function handleGenerate() {
    if (!applicationId) {
      toast.error('Please create an application for this job first')
      return
    }
    setLoading(true)
    try {
      const result = await generateInterviewPrepAction(applicationId)
      if (result.success && result.data) {
        setPrep(result.data)
        toast.success('Interview prep ready!')
      } else {
        toast.error(result.error ?? 'Generation failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {prep && (
          <div className="flex items-center gap-3">
            <Badge variant="outline">Readiness: {prep.readinessScore}%</Badge>
            <span className="text-xs text-muted-foreground">Generated {genDate(prep.createdAt)}</span>
          </div>
        )}
        <Button
          onClick={handleGenerate}
          disabled={loading || !applicationId}
          variant={prep ? 'outline' : 'default'}
          size={prep ? 'sm' : 'default'}
          className={!prep ? 'mx-auto' : 'ml-auto'}
        >
          {loading ? 'Generating...' : prep ? 'Regenerate' : '✦ Generate Interview Prep'}
        </Button>
      </div>

      {!applicationId && !prep && (
        <p className="text-xs text-muted-foreground text-center">Add this job to your board first to generate interview prep.</p>
      )}

      {loading && <AIThinking message="Generating interview questions with Gemini Pro..." lines={6} />}

      {!prep && !loading && applicationId && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground mb-4">
            Generate tailored interview questions for {job.title} at {job.company}
          </p>
        </div>
      )}

      {prep && !loading && <PrepView prep={prep} />}
    </div>
  )
}
