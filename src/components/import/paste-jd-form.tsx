'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AIThinking } from '@/components/ai/ai-thinking'
import { parseJobDescriptionAction } from '@/lib/actions/job.actions'
import type { ParsedJob } from '@/types'

interface PasteJDFormProps {
  onParsed: (job: ParsedJob, rawText: string) => void
}

export function PasteJDForm({ onParsed }: PasteJDFormProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    try {
      const result = await parseJobDescriptionAction(text)
      if (result.success && result.data) {
        onParsed(result.data, text)
      } else {
        toast.error(result.error ?? 'Failed to parse job description')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste the full job description here..."
        className="min-h-[300px] font-mono text-sm resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      {loading && <AIThinking message="Extracting job details with Gemini..." />}
      <Button onClick={handleSubmit} disabled={loading || !text.trim()} className="w-full">
        {loading ? 'Analyzing...' : '✦ Extract with AI'}
      </Button>
    </div>
  )
}
