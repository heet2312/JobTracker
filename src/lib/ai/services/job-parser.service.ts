import { flashModel, generateWithRetry } from '../gemini'
import { buildJobParsePrompt } from '../prompts/job-parse.prompt'
import type { ParsedJob } from '@/types'

export async function parseJobDescription(description: string): Promise<ParsedJob> {
  return generateWithRetry(async () => {
    const prompt = buildJobParsePrompt(description)
    const result = await flashModel.generateContent(prompt)
    const text = result.response.text()
    return JSON.parse(text) as ParsedJob
  })
}

export async function parseJobFromUrl(url: string): Promise<ParsedJob> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; JobTrackerBot/1.0)' },
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Failed to fetch URL: ${response.statusText}`)
  const html = await response.text()
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 15000)
  return parseJobDescription(text)
}
