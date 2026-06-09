import { SettingsModel } from '@/lib/db/models/settings.model'
import { flashModel, proModel } from './gemini'
import { createAIClient, type AIGenerationClient, type AIProvider } from './ai-client'
import type { Types } from 'mongoose'

export interface ResolvedAIClients {
  fast: AIGenerationClient
  deep: AIGenerationClient
}

export async function getUserAIClients(userId: Types.ObjectId): Promise<ResolvedAIClients> {
  const settings = await SettingsModel.findOne({ userId }).lean()

  const provider = settings?.aiProvider as AIProvider | undefined
  const apiKey = settings?.aiApiKey ?? ''
  const model = settings?.aiModel ?? ''

  if (apiKey && provider && model) {
    // User has configured a custom provider — use same model for all operations
    const client = await createAIClient(provider, apiKey, model)
    return { fast: client, deep: client }
  }

  // Fall back to env-var Gemini (Flash for fast ops, Pro for deep analysis)
  return {
    fast: flashModel as unknown as AIGenerationClient,
    deep: proModel as unknown as AIGenerationClient,
  }
}
