import { z } from 'zod'

export const createResumeSchema = z.object({
  name: z.string().min(1, 'Resume name is required'),
  isMaster: z.boolean().default(false),
  content: z.string().min(1, 'Resume content is required'),
  fileUrl: z.string().optional(),
  fileKey: z.string().optional(),
})

export const updateResumeSchema = createResumeSchema.partial()

export type CreateResumeInput = z.infer<typeof createResumeSchema>
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>
