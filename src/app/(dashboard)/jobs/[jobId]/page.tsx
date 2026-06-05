import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getJobById } from '@/lib/actions/job.actions'
import { getApplicationForJob, getActivitiesForJob } from '@/lib/actions/application.actions'
import { getJobAIContent } from '@/lib/actions/ai.actions'
import { JobOverviewTab } from './_components/job-overview-tab'
import { JobDescriptionTab } from './_components/job-description-tab'
import { MatchAnalysisTab } from './_components/match-analysis-tab'
import { ResumeVersionsTab } from './_components/resume-versions-tab'
import { CoverLettersTab } from './_components/cover-letters-tab'
import { OutreachTab } from './_components/outreach-tab'
import { FollowupsTab } from './_components/followups-tab'
import { InterviewPrepTab } from './_components/interview-prep-tab'
import { ActivityTab } from './_components/activity-tab'
import { AddToBoardButton } from './_components/add-to-board-button'

interface JobDetailPageProps {
  params: Promise<{ jobId: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { jobId } = await params
  const [jobResult, appResult, activitiesResult, aiContentResult] = await Promise.all([
    getJobById(jobId),
    getApplicationForJob(jobId),
    getActivitiesForJob(jobId),
    getJobAIContent(jobId),
  ])

  if (!jobResult.success || !jobResult.data) notFound()

  const job = jobResult.data
  const application = appResult.data ?? null
  const activities = activitiesResult.data ?? []
  const aiContent = aiContentResult.data

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{job.title}</h1>
          <p className="text-muted-foreground">
            {job.company}
            {job.location && ` · ${job.location}`}
            {job.locationType && ` · ${job.locationType}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {job.isFavorited && (
            <span className="text-yellow-500 text-lg">★</span>
          )}
          <AddToBoardButton jobId={job._id} application={application} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="analysis">Match Analysis</TabsTrigger>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="cover-letters">Cover Letters</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="followups">Follow-Ups</TabsTrigger>
          <TabsTrigger value="interview">Interview Prep</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <JobOverviewTab job={job} application={application} />
        </TabsContent>
        <TabsContent value="description">
          <JobDescriptionTab job={job} />
        </TabsContent>
        <TabsContent value="analysis">
          <MatchAnalysisTab job={job} existingAnalyses={aiContent?.analyses ?? []} />
        </TabsContent>
        <TabsContent value="resumes">
          <ResumeVersionsTab job={job} existingVersions={aiContent?.resumeVersions ?? []} />
        </TabsContent>
        <TabsContent value="cover-letters">
          <CoverLettersTab job={job} existingLetters={aiContent?.coverLetters ?? []} />
        </TabsContent>
        <TabsContent value="outreach">
          <OutreachTab job={job} existingMessages={aiContent?.outreachMessages ?? []} />
        </TabsContent>
        <TabsContent value="followups">
          <FollowupsTab job={job} applicationId={application?._id} existingFollowUps={aiContent?.followUps ?? []} />
        </TabsContent>
        <TabsContent value="interview">
          <InterviewPrepTab job={job} applicationId={application?._id} existingPrep={aiContent?.interviewPrep ?? null} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityTab activities={activities} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
