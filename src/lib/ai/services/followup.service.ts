import { flashModel, generateWithRetry } from '../gemini'
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
  const model = client ?? (flashModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildFollowUpPrompt(jobTitle, company, contactName, type, context)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as FollowUpMessage
  })
}
