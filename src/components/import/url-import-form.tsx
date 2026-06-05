'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIThinking } from '@/components/ai/ai-thinking'
import { importJobFromUrl } from '@/lib/actions/job.actions'
import type { ParsedJob } from '@/types'

interface UrlImportFormProps {
  onParsed: (job: ParsedJob, url: string) => void
}

export function UrlImportForm({ onParsed }: UrlImportFormProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleImport() {
    if (!url.trim()) return
    setLoading(true)
    try {
      const result = await importJobFromUrl(url)
      if (result.success && result.data) {
        onParsed(result.data, url)
      } else {
        toast.error(result.error ?? 'Failed to import from URL')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="url"
        placeholder="https://company.com/jobs/role-name"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        onKeyDown={(e) => e.key === 'Enter' && handleImport()}
      />
      {loading && <AIThinking message="Fetching and parsing job page..." />}
      <Button onClick={handleImport} disabled={loading || !url.trim()} className="w-full">
        {loading ? 'Importing...' : '✦ Import from URL'}
      </Button>
    </div>
  )
}
