import { generateWithRetry } from '../gemini'
import { buildCoverLetterPrompt } from '../prompts/cover-letter.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { GeneratedCoverLetter, CoverLetterTone } from '@/types'

export async function generateCoverLetter(
  jobDescription: string,
  resumeText: string,
  tone: CoverLetterTone,
  client: AIGenerationClient
): Promise<GeneratedCoverLetter> {
  return generateWithRetry(async () => {
    const prompt = buildCoverLetterPrompt(jobDescription, resumeText, tone)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as GeneratedCoverLetter
  })
}
