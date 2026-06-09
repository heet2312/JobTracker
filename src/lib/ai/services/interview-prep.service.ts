import { generateWithRetry } from '../gemini'
import { buildInterviewPrepPrompt } from '../prompts/interview-prep.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { InterviewPrep } from '@/types'

export async function generateInterviewPrep(
  jobDescription: string,
  resumeText: string,
  company: string,
  client: AIGenerationClient
): Promise<InterviewPrep> {
  return generateWithRetry(async () => {
    const prompt = buildInterviewPrepPrompt(jobDescription, resumeText, company)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as InterviewPrep
  })
}
