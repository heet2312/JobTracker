import { generateWithRetry } from '../gemini'
import { buildJobDiscoverPrompt } from '../prompts/job-discover.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { JobRecommendation, UserPreferences } from '@/types'

export async function discoverJobs(
  preferences: UserPreferences,
  client: AIGenerationClient
): Promise<JobRecommendation[]> {
  return generateWithRetry(async () => {
    const prompt = buildJobDiscoverPrompt(preferences)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as JobRecommendation[]
  })
}
