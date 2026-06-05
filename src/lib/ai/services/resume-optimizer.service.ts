import { proModel, generateWithRetry } from '../gemini'
import { buildResumeOptimizePrompt } from '../prompts/resume-optimize.prompt'
import type { OptimizedResume } from '@/types'

export async function optimizeResume(
  jobDescription: string,
  resumeText: string
): Promise<OptimizedResume> {
  return generateWithRetry(async () => {
    const prompt = buildResumeOptimizePrompt(jobDescription, resumeText)
    const result = await proModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as OptimizedResume
  })
}
