'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MatchScoreRing } from '@/components/ai/match-score-ring'
import { SkillGapList } from '@/components/ai/skill-gap-list'
import { ScoreBreakdown } from '@/components/ai/score-breakdown'
import { AIThinking } from '@/components/ai/ai-thinking'
import { analyzeJobMatch } from '@/lib/actions/ai.actions'
import { useResumes } from '@/lib/hooks/use-resumes'
import type { IJob, IAIAnalysis } from '@/types'

interface MatchAnalysisTabProps {
  job: IJob
  existingAnalyses: IAIAnalysis[]
}

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

function AnalysisView({ analysis }: { analysis: IAIAnalysis }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Overall', value: analysis.overallScore },
          { label: 'Skills', value: analysis.skillsScore },
          { label: 'Experience', value: analysis.experienceScore },
          { label: 'ATS', value: analysis.atsScore },
          { label: 'Keywords', value: analysis.keywordScore },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <MatchScoreRing score={value} size={64} />
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Score Breakdown</CardTitle></CardHeader>
          <CardContent><ScoreBreakdown breakdown={analysis.scoreBreakdown} /></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Skill Gap</CardTitle></CardHeader>
          <CardContent>
            <SkillGapList matchedSkills={analysis.matchedSkills} missingSkills={analysis.missingSkills} />
          </CardContent>
        </Card>
      </div>
      {analysis.suggestions?.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Suggestions</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.suggestions.map((s, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-primary mt-0.5">→</span><span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function MatchAnalysisTab({ job, existingAnalyses }: MatchAnalysisTabProps) {
  const { data: resumes } = useResumes()
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [analyses, setAnalyses] = useState<IAIAnalysis[]>(existingAnalyses)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(analyses.length === 0)

  async function handleAnalyze() {
    if (!selectedResumeId) { toast.error('Please select a resume'); return }
    setLoading(true)
    try {
      const result = await analyzeJobMatch(job._id, selectedResumeId)
      if (result.success && result.data) {
        const updated = [result.data, ...analyses]
        setAnalyses(updated)
        setActiveIdx(0)
        setShowForm(false)
        toast.success('Analysis complete!')
      } else {
        toast.error(result.error ?? 'Analysis failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const current = analyses[activeIdx]

  return (
    <div className="space-y-6">
      {analyses.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {analyses.map((a, i) => (
              <button
                key={a._id}
                onClick={() => setActiveIdx(i)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  i === activeIdx
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {i === 0 ? 'Latest' : `v${analyses.length - i}`} · {a.overallScore}%
                <span className="ml-1.5 opacity-60">{genDate(a.generatedAt)}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '✦ Re-analyze'}
          </Button>
        </div>
      )}

      {showForm && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Analyze match with your resume</p>
            <div className="flex items-center gap-3">
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a resume..." />
                </SelectTrigger>
                <SelectContent>
                  {resumes?.map((r) => (
                    <SelectItem key={r._id} value={r._id}>
                      {r.name} {r.isMaster && '(Master)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAnalyze} disabled={loading || !selectedResumeId}>
                {loading ? 'Analyzing...' : '✦ Analyze'}
              </Button>
            </div>
            {loading && (
              <div className="mt-4">
                <AIThinking message="Running deep match analysis with Gemini Pro..." lines={5} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {current && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            Generated {genDate(current.generatedAt)}
          </p>
          <AnalysisView analysis={current} />
        </div>
      )}

      {analyses.length === 0 && !showForm && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground mb-4">No analysis yet. Run your first match analysis.</p>
          <Button onClick={() => setShowForm(true)}>✦ Analyze Match</Button>
        </div>
      )}
    </div>
  )
}
