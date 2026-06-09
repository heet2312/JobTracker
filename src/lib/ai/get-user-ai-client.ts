import { SettingsModel } from '@/lib/db/models/settings.model'
import { createAIClient, type AIGenerationClient, type AIProvider } from './ai-client'
import type { Types } from 'mongoose'

export interface ResolvedAIClients {
  fast: AIGenerationClient
  deep: AIGenerationClient
}

/**
 * Resolves the AI client for a user using their own API key (from localStorage,
 * passed by the calling client component). Provider and model are read from DB.
 *
 * Throws 'AI_KEY_REQUIRED' if no key is provided — actions catch this and
 * return a helpful message directing the user to Settings.
 */
export async function getUserAIClients(
  userId: Types.ObjectId,
  clientApiKey?: string
): Promise<ResolvedAIClients> {
  if (!clientApiKey) {
    throw new Error('AI_KEY_REQUIRED')
  }

  const settings = await SettingsModel.findOne({ userId }, 'aiProvider aiModel').lean()
  const provider = (settings?.aiProvider ?? 'gemini') as AIProvider
  const model = settings?.aiModel ?? ''

  if (!model) {
    throw new Error('AI_MODEL_REQUIRED')
  }

  const client = await createAIClient(provider, clientApiKey, model)
  return { fast: client, deep: client }
}
