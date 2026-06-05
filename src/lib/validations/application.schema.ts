import { z } from 'zod'

export const createApplicationSchema = z.object({
  jobId: z.string().min(1),
  resumeVersionId: z.string().optional(),
  stage: z
    .enum([
      'saved', 'interested', 'applied', 'assessment', 'screening',
      'interview_1', 'interview_2', 'final', 'offer', 'accepted',
      'rejected', 'ghosted', 'withdrawn',
    ])
    .default('saved'),
  appliedDate: z.string().optional(),
  applicationUrl: z.string().url().optional().or(z.literal('')),
  portalUsername: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactLinkedin: z.string().optional(),
  salaryExpectation: z.number().positive().optional(),
  notes: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

export const updateApplicationStageSchema = z.object({
  stage: z.enum([
    'saved', 'interested', 'applied', 'assessment', 'screening',
    'interview_1', 'interview_2', 'final', 'offer', 'accepted',
    'rejected', 'ghosted', 'withdrawn',
  ]),
  position: z.number().int().min(0),
})

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
