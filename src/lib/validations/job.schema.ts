import { z } from 'zod'

export const createJobSchema = z.object({
  sourceUrl: z.string().url().optional().or(z.literal('')),
  rawDescription: z.string().optional(),
  importMethod: z.enum(['url', 'paste', 'pdf']).default('paste'),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  location: z.string().nullish(),
  locationType: z.enum(['remote', 'hybrid', 'onsite']).nullish(),
  salaryMin: z.number().positive().nullish(),
  salaryMax: z.number().positive().nullish(),
  salaryCurrency: z.string().default('USD'),
  employmentType: z
    .enum(['full-time', 'part-time', 'contract', 'internship'])
    .nullish()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  experienceRequired: z.string().nullish(),
  requiredSkills: z.array(z.string()).default([]),
  preferredSkills: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  industry: z.string().nullish(),
  department: z.string().nullish(),
  seniorityLevel: z.string().nullish(),
  benefits: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  applicationDeadline: z.string().nullish(),
  postedDate: z.string().nullish(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export const updateJobSchema = createJobSchema.partial()

export type CreateJobInput = z.infer<typeof createJobSchema>
export type UpdateJobInput = z.infer<typeof updateJobSchema>
