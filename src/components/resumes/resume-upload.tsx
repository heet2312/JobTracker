'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createResume } from '@/lib/actions/resume.actions'

const pasteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(50, 'Content too short'),
})

type PasteForm = z.infer<typeof pasteSchema>

interface ResumeUploadProps {
  onCreated?: () => void
}

export function ResumeUpload({ onCreated }: ResumeUploadProps) {
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [pdfName, setPdfName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasteForm>({
    resolver: zodResolver(pasteSchema),
  })

  async function onSubmit(data: PasteForm) {
    setLoading(true)
    const result = await createResume({ name: data.name, content: data.content })
    setLoading(false)
    if (result.success) {
      toast.success('Resume saved!')
      reset()
      onCreated?.()
    } else {
      toast.error(result.error ?? 'Failed to save resume')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf') setSelectedFile(file)
    else toast.error('Please drop a PDF file')
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setUploadProgress('Uploading to storage...')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json() as { url?: string; key?: string; name?: string; error?: string }

      if (!res.ok || !data.url) {
        toast.error(data.error ?? 'Upload failed')
        return
      }

      setUploadProgress('Saving resume...')

      const name = pdfName.trim() || selectedFile.name.replace(/\.pdf$/i, '') || 'My Resume'
      const result = await createResume({
        name,
        content: `Uploaded PDF: ${data.name ?? selectedFile.name}`,
        fileUrl: data.url,
        fileKey: data.key,
        isMaster: false,
      })

      if (result.success) {
        toast.success('Resume uploaded!')
        setSelectedFile(null)
        setPdfName('')
        onCreated?.()
      } else {
        toast.error(result.error ?? 'Failed to save resume')
      }
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  return (
    <Tabs defaultValue="paste">
      <TabsList>
        <TabsTrigger value="paste">Paste Text</TabsTrigger>
        <TabsTrigger value="upload">Upload PDF</TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="space-y-3 pt-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="resume-name">Resume Name</Label>
            <Input
              id="resume-name"
              placeholder="e.g. Full Stack, Backend Engineer..."
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="resume-content">Resume Content</Label>
            <Textarea
              id="resume-content"
              placeholder="Paste your resume text here..."
              className="min-h-[300px] font-mono text-xs"
              {...register('content')}
            />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Resume'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="upload" className="pt-3 space-y-3">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('pdf-input')?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Drop your PDF here or click to browse</p>
            <p className="text-xs text-muted-foreground">PDF up to 4MB</p>
            <input
              id="pdf-input"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        ) : (
          <div className="border border-border rounded-lg p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {selectedFile && (
          <div className="space-y-2">
            <Label htmlFor="pdf-resume-name">Resume Name (optional)</Label>
            <Input
              id="pdf-resume-name"
              placeholder="e.g. Full Stack Resume"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              disabled={uploading}
            />
          </div>
        )}

        <Button
          disabled={!selectedFile || uploading}
          onClick={handleUpload}
          className="w-full"
        >
          {uploading ? uploadProgress || 'Uploading...' : 'Upload Resume'}
        </Button>
      </TabsContent>
    </Tabs>
  )
}
