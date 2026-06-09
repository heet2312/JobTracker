import { proModel, generateWithRetry } from '../gemini'
import { buildMatchScorePrompt } from '../prompts/match-score.prompt'
import type { AIGenerationClient } from '../ai-client'
import type { MatchScore } from '@/types'

export async function scoreJobMatch(
  jobDescription: string,
  resumeText: string,
  client?: AIGenerationClient
): Promise<MatchScore> {
  const model = client ?? (proModel as unknown as AIGenerationClient)
  return generateWithRetry(async () => {
    const prompt = buildMatchScorePrompt(jobDescription, resumeText)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as MatchScore
  })
}
