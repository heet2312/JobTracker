'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIThinking } from '@/components/ai/ai-thinking'
import { CopyButton } from '@/components/shared/copy-button'
import { generateOptimizedResume } from '@/lib/actions/ai.actions'
import { useResumes } from '@/lib/hooks/use-resumes'
import { usePDFDownload } from '@/lib/hooks/use-pdf-download'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { IJob, IResumeVersion } from '@/types'

interface ResumeVersionsTabProps {
  job: IJob
  existingVersions: IResumeVersion[]
}

function genDate(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a')
}

function VersionCard({ version, jobTitle }: { version: IResumeVersion; jobTitle: string }) {
  const [expanded, setExpanded] = useState(false)
  const { downloadResumePDF, loading: pdfLoading } = usePDFDownload()

  function handleDownload() {
    const filename = `resume-v${version.versionNumber}-${jobTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`
    downloadResumePDF(version.fullText, filename, version.atsScore)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge>v{version.versionNumber}</Badge>
            {version.atsScore !== undefined && <Badge variant="outline">ATS: {version.atsScore}%</Badge>}
            <Badge variant="secondary">{version.wordCount} words</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{genDate(version.createdAt)}</span>
            <CopyButton text={version.fullText} size="icon" />
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
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-3">
          {version.changes?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Changes Made</p>
              <ul className="space-y-1">
                {version.changes.map((c, i) => (
                  <li key={i} className="text-xs flex gap-1.5">
                    <span className="text-primary">✓</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed text-foreground/80 max-h-96 overflow-y-auto bg-muted/30 rounded p-3">
            {version.fullText}
          </pre>
        </CardContent>
      )}
    </Card>
  )
}

export function ResumeVersionsTab({ job, existingVersions }: ResumeVersionsTabProps) {
  const { data: resumes } = useResumes()
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [loading, setLoading] = useState(false)
  const [versions, setVersions] = useState<IResumeVersion[]>(existingVersions)

  async function handleGenerate() {
    if (!selectedResumeId) { toast.error('Select a resume'); return }
    setLoading(true)
    try {
      const result = await generateOptimizedResume(job._id, selectedResumeId)
      if (result.success && result.data) {
        const newVersion: IResumeVersion = {
          _id: result.data._id,
          resumeId: selectedResumeId,
          userId: '',
          jobId: job._id,
          versionNumber: versions.length + 1,
          content: result.data.fullText,
          fullText: result.data.fullText,
          changes: result.data.changes,
          atsScore: result.data.atsScore,
          wordCount: result.data.fullText.split(/\s+/).filter(Boolean).length,
          isActive: true,
          createdAt: new Date().toISOString(),
        }
        setVersions((prev) => [newVersion, ...prev])
        toast.success('Optimized resume generated!')
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
        <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
          <SelectTrigger className="flex-1 max-w-xs">
            <SelectValue placeholder="Select base resume..." />
          </SelectTrigger>
          <SelectContent>
            {resumes?.map((r) => (
              <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={loading || !selectedResumeId}>
          {loading ? 'Optimizing...' : '✦ Optimize Resume'}
        </Button>
      </div>

      {loading && <AIThinking message="Optimizing your resume for this role..." lines={6} />}

      {versions.length === 0 && !loading && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No optimized resumes yet. Generate your first version above.</p>
        </div>
      )}

      {versions.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">{versions.length} version{versions.length !== 1 ? 's' : ''} generated</p>
          {versions.map((v) => (
            <VersionCard key={v._id} version={v} jobTitle={job.title} />
          ))}
        </div>
      )}
    </div>
  )
}
