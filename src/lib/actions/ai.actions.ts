'use server'

import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db/connect'
import { JobModel } from '@/lib/db/models/job.model'
import { ResumeModel } from '@/lib/db/models/resume.model'
import { ResumeVersionModel } from '@/lib/db/models/resume-version.model'
import { ApplicationModel } from '@/lib/db/models/application.model'
import { AIAnalysisModel } from '@/lib/db/models/ai-analysis.model'
import { CoverLetterModel } from '@/lib/db/models/cover-letter.model'
import { OutreachMessageModel } from '@/lib/db/models/outreach-message.model'
import { FollowUpModel } from '@/lib/db/models/follow-up.model'
import { ProfileModel } from '@/lib/db/models/profile.model'
import { InterviewRoundModel } from '@/lib/db/models/interview-round.model'
import { scoreJobMatch } from '@/lib/ai/services/match-scorer.service'
import { optimizeResume } from '@/lib/ai/services/resume-optimizer.service'
import { generateCoverLetter } from '@/lib/ai/services/cover-letter.service'
import { generateOutreachMessages } from '@/lib/ai/services/outreach.service'
import { generateInterviewPrep } from '@/lib/ai/services/interview-prep.service'
import { generateFollowUpMessage } from '@/lib/ai/services/followup.service'
import { discoverJobs } from '@/lib/ai/services/job-discovery.service'
import { getUserAIClients } from '@/lib/ai/get-user-ai-client'
import { logActivity } from './activity.actions'
import { syncUser } from './user.actions'
import { countWords } from '@/lib/utils/format'
import type {
  IAIAnalysis, ICoverLetter, IOutreachMessage, IFollowUp, IResumeVersion,
  InterviewPrep, IStoredInterviewPrep, JobRecommendation, CoverLetterTone, FollowUpType, ActionResult
} from '@/types'

export async function analyzeJobMatch(
  jobId: string,
  resumeId: string
): Promise<ActionResult<IAIAnalysis>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const [job, resume, { deep }] = await Promise.all([
      JobModel.findOne({ _id: jobId, userId }).lean(),
      ResumeModel.findOne({ _id: resumeId, userId }).lean(),
      getUserAIClients(userId),
    ])
    if (!job) return { success: false, error: 'Job not found' }
    if (!resume) return { success: false, error: 'Resume not found' }
    const score = await scoreJobMatch(job.rawDescription ?? job.title, resume.content, deep)
    const analysis = await AIAnalysisModel.create({
      userId,
      jobId,
      resumeId,
      ...score,
      generatedAt: new Date(),
      model: process.env.GEMINI_PRO_MODEL ?? 'gemini-pro',
    })
    await logActivity({
      type: 'analysis_generated',
      title: `Match analysis for "${job.title}"`,
      jobId,
    })
    return { success: true, data: JSON.parse(JSON.stringify(analysis)) as IAIAnalysis }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function generateOptimizedResume(
  jobId: string,
  resumeId: string
): Promise<ActionResult<{ _id: string; fullText: string; changes: string[]; atsScore: number }>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const [job, resume] = await Promise.all([
      JobModel.findOne({ _id: jobId, userId }).lean(),
      ResumeModel.findOne({ _id: resumeId, userId }).lean(),
    ])
    if (!job || !resume) return { success: false, error: 'Job or resume not found' }
    const { deep } = await getUserAIClients(userId)
    const optimized = await optimizeResume(job.rawDescription ?? job.title, resume.content, deep)
    const lastVersion = await ResumeVersionModel.findOne({ resumeId }).sort({ versionNumber: -1 }).lean()
    const versionNumber = (lastVersion?.versionNumber ?? 0) + 1
    const version = await ResumeVersionModel.create({
      resumeId,
      userId,
      jobId,
      versionNumber,
      content: optimized.fullText,
      fullText: optimized.fullText,
      changes: optimized.changes,
      atsScore: optimized.atsScore,
      wordCount: countWords(optimized.fullText),
    })
    await ResumeModel.findByIdAndUpdate(resumeId, { $push: { versions: version._id } })
    await logActivity({ type: 'resume_generated', title: `Optimized resume for "${job.title}"`, jobId })
    return {
      success: true,
      data: {
        _id: String(version._id),
        fullText: optimized.fullText,
        changes: optimized.changes,
        atsScore: optimized.atsScore,
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function generateCoverLetterAction(
  jobId: string,
  tone: CoverLetterTone
): Promise<ActionResult<ICoverLetter>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.findOne({ _id: jobId, userId }).lean()
    if (!job) return { success: false, error: 'Job not found' }
    const resume = await ResumeModel.findOne({ userId, isMaster: true }).lean()
      ?? await ResumeModel.findOne({ userId }).lean()
    if (!resume) return { success: false, error: 'No resume found. Please upload a resume first.' }
    const { deep } = await getUserAIClients(userId)
    const generated = await generateCoverLetter(job.rawDescription ?? job.title, resume.content, tone, deep)
    const letter = await CoverLetterModel.create({
      userId,
      jobId,
      resumeId: resume._id,
      tone,
      content: generated.content,
      subject: generated.subject,
      wordCount: generated.wordCount,
      version: 1,
      generatedAt: new Date(),
    })
    await logActivity({ type: 'cover_letter_generated', title: `Cover letter for "${job.title}"`, jobId })
    return { success: true, data: JSON.parse(JSON.stringify(letter)) as ICoverLetter }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function generateOutreachAction(
  jobId: string
): Promise<ActionResult<IOutreachMessage[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const job = await JobModel.findOne({ _id: jobId, userId }).lean()
    if (!job) return { success: false, error: 'Job not found' }
    const resume = await ResumeModel.findOne({ userId, isMaster: true }).lean()
      ?? await ResumeModel.findOne({ userId }).lean()
    const summary = resume?.content.slice(0, 1000) ?? ''
    const { fast } = await getUserAIClients(userId)
    const messages = await generateOutreachMessages(job.title, job.company, summary, fast)
    const types = [
      { type: 'recruiter-email' as const, data: messages.recruiterEmail },
      { type: 'hiring-manager-email' as const, data: messages.hiringManagerEmail },
      { type: 'linkedin-connect' as const, data: { subject: undefined, body: messages.linkedinConnect.message } },
      { type: 'linkedin-followup' as const, data: { subject: undefined, body: messages.linkedinFollowup.message } },
      { type: 'cold-outreach' as const, data: messages.coldOutreach },
    ]
    const created = await Promise.all(
      types.map(({ type, data }) =>
        OutreachMessageModel.create({
          userId,
          jobId,
          type,
          subject: 'subject' in data ? data.subject : undefined,
          content: 'body' in data ? data.body : '',
          generatedAt: new Date(),
        })
      )
    )
    await logActivity({ type: 'outreach_created', title: `Outreach messages for "${job.title}"`, jobId })
    return { success: true, data: JSON.parse(JSON.stringify(created)) as IOutreachMessage[] }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function generateInterviewPrepAction(
  applicationId: string
): Promise<ActionResult<IStoredInterviewPrep>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const application = await ApplicationModel.findOne({ _id: applicationId, userId })
      .populate('jobId')
      .lean()
    if (!application) return { success: false, error: 'Application not found' }
    const job = application.jobId as unknown as Record<string, unknown>
    const resume = await ResumeModel.findOne({ userId, isMaster: true }).lean()
      ?? await ResumeModel.findOne({ userId }).lean()
    const { deep } = await getUserAIClients(userId)
    const prep = await generateInterviewPrep(
      (job?.rawDescription as string) ?? (job?.title as string) ?? '',
      resume?.content ?? '',
      (job?.company as string) ?? '',
      deep
    )
    const stored = await InterviewRoundModel.create({
      userId,
      applicationId,
      isAIPrep: true,
      roundNumber: 0,
      interviewers: [],
      technicalQuestions: prep.technicalQuestions,
      behavioralQuestions: prep.behavioralQuestions,
      companyQuestions: prep.companyQuestions,
      systemDesignTopics: prep.systemDesignTopics,
      readinessScore: prep.readinessScore,
      prepPlan: prep.prepPlan,
    })
    await logActivity({ type: 'interview_scheduled', title: 'Interview prep generated', applicationId })
    return { success: true, data: JSON.parse(JSON.stringify(stored)) as IStoredInterviewPrep }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function generateFollowUpAction(
  applicationId: string,
  type: FollowUpType
): Promise<ActionResult<IFollowUp>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const application = await ApplicationModel.findOne({ _id: applicationId, userId })
      .populate('jobId')
      .lean()
    if (!application) return { success: false, error: 'Application not found' }
    const job = application.jobId as unknown as Record<string, unknown>
    const { fast } = await getUserAIClients(userId)
    const message = await generateFollowUpMessage(
      (job?.title as string) ?? '',
      (job?.company as string) ?? '',
      application.contactName ?? '',
      type,
      undefined,
      fast
    )
    const followUp = await FollowUpModel.create({
      userId,
      applicationId,
      type,
      subject: message.subject,
      content: message.content,
      status: 'pending',
      channel: 'email',
    })
    await logActivity({ type: 'followup_sent', title: 'Follow-up generated', applicationId })
    return { success: true, data: JSON.parse(JSON.stringify(followUp)) as IFollowUp }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export interface JobAIContent {
  analyses: IAIAnalysis[]
  coverLetters: ICoverLetter[]
  outreachMessages: IOutreachMessage[]
  resumeVersions: IResumeVersion[]
  followUps: IFollowUp[]
  interviewPrep: IStoredInterviewPrep | null
}

export async function getJobAIContent(jobId: string): Promise<ActionResult<JobAIContent>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()

    const application = await ApplicationModel.findOne({ userId, jobId }).lean()
    const applicationId = application?._id

    const [analyses, coverLetters, outreachMessages, resumeVersions, followUps] = await Promise.all([
      AIAnalysisModel.find({ userId, jobId }).sort({ generatedAt: -1 }).lean(),
      CoverLetterModel.find({ userId, jobId }).sort({ generatedAt: -1 }).lean(),
      OutreachMessageModel.find({ userId, jobId }).sort({ generatedAt: -1 }).limit(5).lean(),
      ResumeVersionModel.find({ userId, jobId }).sort({ createdAt: -1 }).lean(),
      applicationId
        ? FollowUpModel.find({ userId, applicationId }).sort({ createdAt: -1 }).lean()
        : Promise.resolve([]),
    ])

    let interviewPrep: IStoredInterviewPrep | null = null
    if (applicationId) {
      const prep = await InterviewRoundModel.findOne({
        userId,
        applicationId,
        isAIPrep: true,
      }).sort({ createdAt: -1 }).lean()
      if (prep) interviewPrep = JSON.parse(JSON.stringify(prep)) as IStoredInterviewPrep
    }

    return {
      success: true,
      data: {
        analyses: JSON.parse(JSON.stringify(analyses)) as IAIAnalysis[],
        coverLetters: JSON.parse(JSON.stringify(coverLetters)) as ICoverLetter[],
        outreachMessages: JSON.parse(JSON.stringify(outreachMessages)) as IOutreachMessage[],
        resumeVersions: JSON.parse(JSON.stringify(resumeVersions)) as IResumeVersion[],
        followUps: JSON.parse(JSON.stringify(followUps)) as IFollowUp[],
        interviewPrep,
      },
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function discoverJobsAction(overrides?: Partial<{
  targetRoles: string[]
  skills: string[]
  targetLocations: string[]
  remotePreference: string
  experienceLevel: string
  industries: string[]
}>): Promise<ActionResult<JobRecommendation[]>> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return { success: false, error: 'Unauthorized' }
    await connectDB()
    const userId = await syncUser()
    const profile = await ProfileModel.findOne({ userId }).lean()
    if (!profile) return { success: false, error: 'Please complete your profile first.' }
    const { deep } = await getUserAIClients(userId)
    const recommendations = await discoverJobs({
      targetRoles: overrides?.targetRoles ?? profile.targetRoles,
      skills: overrides?.skills ?? profile.skills,
      targetLocations: overrides?.targetLocations ?? profile.targetLocations,
      remotePreference: overrides?.remotePreference ?? profile.remotePreference,
      experienceLevel: overrides?.experienceLevel ?? profile.experienceLevel ?? 'mid',
      industries: overrides?.industries ?? profile.industries,
      targetSalaryMin: profile.targetSalaryMin,
      targetSalaryMax: profile.targetSalaryMax,
    }, deep)
    return { success: true, data: recommendations }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
