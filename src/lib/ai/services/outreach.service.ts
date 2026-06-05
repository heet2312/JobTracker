import { flashModel, generateWithRetry } from '../gemini'
import { buildOutreachPrompt } from '../prompts/outreach.prompt'
import type { OutreachMessages } from '@/types'

export async function generateOutreachMessages(
  jobTitle: string,
  company: string,
  resumeSummary: string
): Promise<OutreachMessages> {
  return generateWithRetry(async () => {
    const prompt = buildOutreachPrompt(jobTitle, company, resumeSummary)
    const result = await flashModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as OutreachMessages
  })
}
