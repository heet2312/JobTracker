'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResumeCard } from '@/components/resumes/resume-card'
import { ResumeUpload } from '@/components/resumes/resume-upload'
import { EmptyState } from '@/components/shared/empty-state'
import { ListSkeleton } from '@/components/shared/loading-skeleton'
import { useResumes } from '@/lib/hooks/use-resumes'
import { FileText } from 'lucide-react'

export default function ResumesPage() {
  const { data: resumes, isLoading, refetch } = useResumes()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = useCallback(() => {
    refetch()
    setRefreshKey((k) => k + 1)
  }, [refetch])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your resume library and versions</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-tour="resume-upload">
          <CardHeader>
            <CardTitle className="text-base">Add Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeUpload key={refreshKey} onCreated={handleRefresh} />
          </CardContent>
        </Card>
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Resume Library
          </h2>
          {isLoading && <ListSkeleton count={3} />}
          {!isLoading && (!resumes || resumes.length === 0) && (
            <EmptyState
              icon={FileText}
              title="No resumes yet"
              description="Upload or paste your resume to get started with AI analysis and optimization."
            />
          )}
          {resumes?.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDeleted={handleRefresh}
              onMasterSet={handleRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
