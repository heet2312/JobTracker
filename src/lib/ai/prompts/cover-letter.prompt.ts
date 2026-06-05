export type CoverLetterTone = 'professional' | 'startup' | 'enterprise' | 'faang' | 'remote'

const TONE_GUIDANCE: Record<CoverLetterTone, string> = {
  professional: 'Formal, polished, traditional business language',
  startup: 'Casual, enthusiastic, show passion for the mission, cultural fit',
  enterprise: 'Conservative, achievement-focused, emphasize reliability and scale',
  faang: 'Technical depth, impact at scale, data-driven achievements, growth mindset',
  remote: 'Self-directed, async communication skills, timezone flexibility, home office setup',
}

export function buildCoverLetterPrompt(
  jobDescription: string,
  resumeText: string,
  tone: CoverLetterTone
): string {
  return `You are an expert cover letter writer. Create a compelling cover letter for the following job.

Tone style: ${tone} — ${TONE_GUIDANCE[tone]}

Return a JSON object with exactly this structure:
{
  "subject": string,
  "content": string,
  "wordCount": number,
  "tone": string,
  "highlights": string[]
}

Rules:
- content: 3-4 paragraphs, ~300-400 words
- Opening: hook that references the specific role and why you're excited
- Body: 2 paragraphs connecting specific resume achievements to job requirements
- Closing: call-to-action, availability, enthusiasm
- subject: professional email subject line
- highlights: 3-5 key selling points you used
- Never use generic filler phrases like "I am writing to apply"

Job Description:
${jobDescription}

Resume:
${resumeText}`
}
