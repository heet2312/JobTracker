import { proModel, generateWithRetry } from '../gemini'
import { buildInterviewPrepPrompt } from '../prompts/interview-prep.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { InterviewPrep } from '@/types'

export async function generateInterviewPrep(
  jobDescription: string,
  resumeText: string,
  company: string,
  client?: AIGenerationClient
): Promise<InterviewPrep> {
  const model = client ?? (proModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildInterviewPrepPrompt(jobDescription, resumeText, company)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as InterviewPrep
  })
}
