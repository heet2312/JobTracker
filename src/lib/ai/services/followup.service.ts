import { flashModel, generateWithRetry } from '../gemini'
import { buildFollowUpPrompt } from '../prompts/followup.prompt'
import type { FollowUpMessage, FollowUpType } from '@/types'

export async function generateFollowUpMessage(
  jobTitle: string,
  company: string,
  contactName: string,
  type: FollowUpType,
  context?: string
): Promise<FollowUpMessage> {
  return generateWithRetry(async () => {
    const prompt = buildFollowUpPrompt(jobTitle, company, contactName, type, context)
    const result = await flashModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as FollowUpMessage
  })
}
