'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AIThinking } from '@/components/ai/ai-thinking'
import { importJobFromUrl } from '@/lib/actions/job.actions'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'
import type { ParsedJob } from '@/types'

interface UrlImportFormProps {
  onParsed: (job: ParsedJob, url: string) => void
  prefillUrl?: string
}

export function UrlImportForm({ onParsed, prefillUrl }: UrlImportFormProps) {
  const [url, setUrl] = useState(prefillUrl ?? '')
  const [loading, setLoading] = useState(false)
  const { getKey } = useLocalApiKey()

  // Auto-trigger import when a URL is prefilled (e.g. from Chrome extension)
  useEffect(() => {
    if (prefillUrl) handleImport(prefillUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleImport(target?: string) {
    const importUrl = target ?? url
    if (!importUrl.trim()) return
    setLoading(true)
    try {
      const result = await importJobFromUrl(importUrl, getKey() || undefined)
      if (result.success && result.data) {
        onParsed(result.data, importUrl)
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
      <Button onClick={() => handleImport()} disabled={loading || !url.trim()} className="w-full">
        {loading ? 'Importing...' : '✦ Import from URL'}
      </Button>
    </div>
  )
}
