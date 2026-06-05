'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PasteJDForm } from './paste-jd-form'
import { UrlImportForm } from './url-import-form'
import { PdfUploadForm } from './pdf-upload-form'
import { createJob } from '@/lib/actions/job.actions'
import type { ParsedJob } from '@/types'

export function ImportTabs() {
  const router = useRouter()
  const [parsed, setParsed] = useState<ParsedJob | null>(null)
  const [rawText, setRawText] = useState('')
  const [importMethod, setImportMethod] = useState<'paste' | 'url' | 'pdf'>('paste')
  const [saving, setSaving] = useState(false)

  function handleParsed(job: ParsedJob, raw: string, method: 'paste' | 'url' | 'pdf' = 'paste') {
    setParsed(job)
    setRawText(raw)
    setImportMethod(method)
  }

  async function handleSave(analyze = false) {
    if (!parsed) return
    setSaving(true)
    try {
      const result = await createJob({
        ...parsed,
        rawDescription: rawText,
        importMethod,
        requiredSkills: parsed.requiredSkills ?? [],
        preferredSkills: parsed.preferredSkills ?? [],
        responsibilities: parsed.responsibilities ?? [],
        keywords: parsed.keywords ?? [],
        benefits: parsed.benefits ?? [],
        techStack: parsed.techStack ?? [],
      })
      if (result.success && result.data) {
        toast.success('Job saved!')
        router.push(`/jobs/${result.data._id}`)
      } else {
        toast.error(result.error ?? 'Failed to save job')
      }
    } finally {
      setSaving(false)
    }
  }

  if (parsed) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-semibold mb-1">Review extracted data</h2>
          <p className="text-sm text-muted-foreground">Verify the AI extracted the correct information</p>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Job Title</Label>
                <p className="text-sm font-medium mt-0.5">{parsed.title || '—'}</p>
              </div>
              <div>
                <Label className="text-xs">Company</Label>
                <p className="text-sm font-medium mt-0.5">{parsed.company || '—'}</p>
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <p className="text-sm mt-0.5">{parsed.location || '—'}</p>
              </div>
              <div>
                <Label className="text-xs">Type</Label>
                <p className="text-sm mt-0.5">{parsed.locationType || '—'} · {parsed.employmentType || '—'}</p>
              </div>
              <div>
                <Label className="text-xs">Salary</Label>
                <p className="text-sm mt-0.5">
                  {parsed.salaryMin ? `$${parsed.salaryMin.toLocaleString()} – $${parsed.salaryMax?.toLocaleString()}` : 'Not specified'}
                </p>
              </div>
              <div>
                <Label className="text-xs">Seniority</Label>
                <p className="text-sm mt-0.5">{parsed.seniorityLevel || '—'}</p>
              </div>
            </div>
            {parsed.requiredSkills?.length > 0 && (
              <div>
                <Label className="text-xs mb-1.5 block">Required Skills</Label>
                <div className="flex flex-wrap gap-1">
                  {parsed.requiredSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setParsed(null)}>← Back</Button>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            Save Job
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Analyze Match →'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <Tabs defaultValue="paste">
        <TabsList className="mb-6">
          <TabsTrigger value="paste">Paste JD</TabsTrigger>
          <TabsTrigger value="url">Job URL</TabsTrigger>
          <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
        </TabsList>
        <TabsContent value="paste">
          <PasteJDForm onParsed={(job, raw) => handleParsed(job, raw, 'paste')} />
        </TabsContent>
        <TabsContent value="url">
          <UrlImportForm onParsed={(job, url) => handleParsed(job, url, 'url')} />
        </TabsContent>
        <TabsContent value="pdf">
          <PdfUploadForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
