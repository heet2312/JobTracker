'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AIThinking } from '@/components/ai/ai-thinking'
import { parsePDFJobAction } from '@/lib/actions/job.actions'
import { useLocalApiKey } from '@/lib/hooks/use-api-key'
import type { ParsedJob } from '@/types'

interface PdfUploadFormProps {
  onParsed: (job: ParsedJob, raw: string, method: 'pdf') => void
}

export function PdfUploadForm({ onParsed }: PdfUploadFormProps) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { getKey } = useLocalApiKey()

  function handleFileSelect(selected: File | null) {
    if (!selected) return
    if (selected.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10 MB')
      return
    }
    setFile(selected)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFileSelect(e.dataTransfer.files[0] ?? null)
  }

  async function handleParse() {
    if (!file) return
    setLoading(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const result = await parsePDFJobAction(base64, getKey() || undefined)
      if (result.success && result.data) {
        onParsed(result.data, `[PDF: ${file.name}]`, 'pdf')
      } else {
        toast.error(result.error ?? 'Failed to parse PDF')
      }
    } catch {
      toast.error('Failed to read PDF file')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AIThinking message="Extracting job details from PDF..." lines={5} />
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-sm font-medium mb-1">Drop a PDF job posting here</h3>
        <p className="text-xs text-muted-foreground mb-4">or click to browse your files</p>
        <Button variant="outline" size="sm" type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
          Browse files
        </Button>
        <p className="text-xs text-muted-foreground mt-3">PDF files up to 10 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
        />
      </div>

      {file && (
        <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleParse}>
              ✦ Extract with AI
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFile(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
