import { proModel, generateWithRetry } from '../gemini'
import { buildResumeOptimizePrompt } from '../prompts/resume-optimize.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { OptimizedResume } from '@/types'

export async function optimizeResume(
  jobDescription: string,
  resumeText: string,
  client?: AIGenerationClient
): Promise<OptimizedResume> {
  const model = client ?? (proModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildResumeOptimizePrompt(jobDescription, resumeText)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as OptimizedResume
  })
}
