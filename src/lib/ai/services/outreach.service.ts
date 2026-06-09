import { flashModel, generateWithRetry } from '../gemini'
import { buildOutreachPrompt } from '../prompts/outreach.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { OutreachMessages } from '@/types'

export async function generateOutreachMessages(
  jobTitle: string,
  company: string,
  resumeSummary: string,
  client?: AIGenerationClient
): Promise<OutreachMessages> {
  const model = client ?? (flashModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildOutreachPrompt(jobTitle, company, resumeSummary)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as OutreachMessages
  })
}
