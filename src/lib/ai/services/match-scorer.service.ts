import { proModel, generateWithRetry } from '../gemini'
import { buildMatchScorePrompt } from '../prompts/match-score.prompt'
import type { MatchScore } from '@/types'

export async function scoreJobMatch(jobDescription: string, resumeText: string): Promise<MatchScore> {
  return generateWithRetry(async () => {
    const prompt = buildMatchScorePrompt(jobDescription, resumeText)
    const result = await proModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as MatchScore
  })
}
