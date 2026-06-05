import { proModel, generateWithRetry } from '../gemini'
import { buildInterviewPrepPrompt } from '../prompts/interview-prep.prompt'
import type { InterviewPrep } from '@/types'

export async function generateInterviewPrep(
  jobDescription: string,
  resumeText: string,
  company: string
): Promise<InterviewPrep> {
  return generateWithRetry(async () => {
    const prompt = buildInterviewPrepPrompt(jobDescription, resumeText, company)
    const result = await proModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as InterviewPrep
  })
}
