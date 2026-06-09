import { proModel, generateWithRetry } from '../gemini'
import { buildCoverLetterPrompt } from '../prompts/cover-letter.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { GeneratedCoverLetter, CoverLetterTone } from '@/types'

export async function generateCoverLetter(
  jobDescription: string,
  resumeText: string,
  tone: CoverLetterTone,
  client?: AIGenerationClient
): Promise<GeneratedCoverLetter> {
  const model = client ?? (proModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildCoverLetterPrompt(jobDescription, resumeText, tone)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as GeneratedCoverLetter
  })
}
