import { generateWithRetry } from '../gemini'
import { buildMatchScorePrompt } from '../prompts/match-score.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { MatchScore } from '@/types'

export async function scoreJobMatch(
  jobDescription: string,
  resumeText: string,
  client: AIGenerationClient
): Promise<MatchScore> {
  return generateWithRetry(async () => {
    const prompt = buildMatchScorePrompt(jobDescription, resumeText)
    const result = await client.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as MatchScore
  })
}
