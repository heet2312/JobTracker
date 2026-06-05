import { z } from 'zod'

export const updateProfileSchema = z.object({
  headline: z.string().optional(),
  summary: z.string().optional(),
  targetRoles: z.array(z.string()).default([]),
  targetLocations: z.array(z.string()).default([]),
  targetSalaryMin: z.number().positive().optional(),
  targetSalaryMax: z.number().positive().optional(),
  remotePreference: z.enum(['remote', 'hybrid', 'onsite', 'any']).default('any'),
  experienceLevel: z
    .enum(['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'executive'])
    .optional(),
  skills: z.array(z.string()).default([]),
  industries: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  activeJobSearching: z.boolean().default(true),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
