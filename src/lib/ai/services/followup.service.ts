import { generateWithRetry } from '../gemini'
import { buildFollowUpPrompt } from '../prompts/followup.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { FollowUpMessage, FollowUpType } from '@/types'

export async function generateFollowUpMessage(
  jobTitle: string,
  company: string,
  contactName: string,
  type: FollowUpType,
  context?: string,
  client?: AIGenerationClient
): Promise<FollowUpMessage> {
  if (!client) throw new Error('AI_KEY_REQUIRED')
  return generateWithRetry(async () => {
    const prompt = buildFollowUpPrompt(jobTitle, company, contactName, type, context)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as FollowUpMessage
  })
}
