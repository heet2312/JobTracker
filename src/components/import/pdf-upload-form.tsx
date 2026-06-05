'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PdfUploadForm() {
  const [dragging, setDragging] = useState(false)

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        dragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false) }}
    >
      <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
      <h3 className="text-sm font-medium mb-1">Drop a PDF job posting here</h3>
      <p className="text-xs text-muted-foreground mb-4">or click to browse your files</p>
      <Button variant="outline" size="sm" asChild>
        <label className="cursor-pointer">
          Browse files
          <input type="file" accept=".pdf" className="hidden" />
        </label>
      </Button>
      <p className="text-xs text-muted-foreground mt-3">PDF files up to 10MB</p>
    </div>
  )
}
