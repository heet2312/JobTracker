import { generateWithRetry } from '../gemini'
import { buildResumeOptimizePrompt } from '../prompts/resume-optimize.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { OptimizedResume } from '@/types'

export async function optimizeResume(
  jobDescription: string,
  resumeText: string,
  client: AIGenerationClient
): Promise<OptimizedResume> {
  return generateWithRetry(async () => {
    const prompt = buildResumeOptimizePrompt(jobDescription, resumeText)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as OptimizedResume
  })
}
