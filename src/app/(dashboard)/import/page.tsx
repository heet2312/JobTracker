import { ImportTabs } from '@/components/import/import-tabs'

interface ImportPageProps {
  searchParams: Promise<{ url?: string }>
}

export default async function ImportPage({ searchParams }: ImportPageProps) {
  const { url } = await searchParams
  const prefillUrl = typeof url === 'string' && url.startsWith('http') ? url : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Import Job</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Paste a job description, import from URL, or upload a PDF
        </p>
      </div>
      <ImportTabs prefillUrl={prefillUrl} />
    </div>
  )
}
