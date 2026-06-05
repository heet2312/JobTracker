import { ImportTabs } from '@/components/import/import-tabs'

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Job</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste a job description, import from URL, or upload a PDF
        </p>
      </div>
      <ImportTabs />
    </div>
  )
}
