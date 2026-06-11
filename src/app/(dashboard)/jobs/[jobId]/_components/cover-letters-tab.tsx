'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AIThinking } from '@/components/ai/ai-thinking'
import { CopyButton } from '@/components/shared/copy-button'
import { generateCoverLetterAction } from '@/lib/actions/ai.actions'
import { usePDFDownload } from '@/lib/hooks/use-pdf-download'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'
import type { IJob, ICoverLetter, CoverLetterTone } from '@/types'

interface CoverLettersTabProps {
  job: IJob
  existingLetters: ICoverLetter[]
}

const TONES: { value: CoverLetterTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'startup', label: 'Startup / Casual' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'faang', label: 'FAANG / Big Tech' },
  { value: 'remote', label: 'Remote-first' },
]

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

function LetterCard({ letter, jobTitle }: { letter: ICoverLetter; jobTitle: string }) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState(letter.content)
  const { downloadCoverLetterPDF, loading: pdfLoading } = usePDFDownload()

  function handleDownload() {
    const filename = `cover-letter-${letter.tone}-${jobTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`
    downloadCoverLetterPDF(letter.subject, content, filename, letter.tone, letter.generatedAt)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{letter.tone}</Badge>
            <Badge variant="secondary">{letter.wordCount} words</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{genDate(letter.generatedAt)}</span>
            <CopyButton text={`Subject: ${letter.subject}\n\n${content}`} size="icon" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDownload}
              disabled={pdfLoading}
              title="Download PDF"
            >
              <FileDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Subject: {letter.subject}</p>
      </CardHeader>
      {expanded && (
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] font-sans text-sm leading-relaxed resize-none"
          />
        </CardContent>
      )}
    </Card>
  )
}

export function CoverLettersTab({ job, existingLetters }: CoverLettersTabProps) {
  const [tone, setTone] = useState<CoverLetterTone>('professional')
  const [loading, setLoading] = useState(false)
  const [letters, setLetters] = useState<ICoverLetter[]>(existingLetters)
  const { getKey } = useLocalApiKey()

  async function handleGenerate() {
    setLoading(true)
    try {
      const result = await generateCoverLetterAction(job._id, tone, getKey() || undefined)
      if (result.success && result.data) {
        setLetters((prev) => [result.data!, ...prev])
        toast.success('Cover letter generated!')
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
        <Select value={tone} onValueChange={(v) => setTone(v as CoverLetterTone)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TONES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : '✦ Generate Cover Letter'}
        </Button>
      </div>

      {loading && <AIThinking message="Writing your cover letter with Gemini Pro..." lines={8} />}

      {letters.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No cover letters yet. Generate your first one above.</p>
        </div>
      )}

      {letters.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{letters.length} cover letter{letters.length !== 1 ? 's' : ''} generated</p>
          {letters.map((letter) => (
            <LetterCard key={letter._id} letter={letter} jobTitle={job.title} />
          ))}
        </div>
      )}
    </div>
  )
}
