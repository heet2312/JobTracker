import { proModel, generateWithRetry } from '../gemini'
import { buildJobDiscoverPrompt } from '../prompts/job-discover.prompt'
import type { JobRecommendation, UserPreferences } from '@/types'

export async function discoverJobs(preferences: UserPreferences): Promise<JobRecommendation[]> {
  return generateWithRetry(async () => {
    const prompt = buildJobDiscoverPrompt(preferences)
    const result = await proModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as JobRecommendation[]
  })
}
