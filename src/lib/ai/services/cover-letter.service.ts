import { proModel, generateWithRetry } from '../gemini'
import { buildCoverLetterPrompt } from '../prompts/cover-letter.prompt'
import type { GeneratedCoverLetter, CoverLetterTone } from '@/types'

export async function generateCoverLetter(
  jobDescription: string,
  resumeText: string,
  tone: CoverLetterTone
): Promise<GeneratedCoverLetter> {
  return generateWithRetry(async () => {
    const prompt = buildCoverLetterPrompt(jobDescription, resumeText, tone)
    const result = await proModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as GeneratedCoverLetter
  })
}
