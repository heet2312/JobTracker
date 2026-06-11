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

Return ONLY a raw JSON object (no markdown code fences, no commentary before or after) with exactly this structure:
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
- GROUNDING: Only reference companies, roles, achievements, metrics, and dates that
  appear in the Resume below. Do not invent or embellish numbers, titles, or projects.
  If the resume lacks a strong match for a requirement, address it through transferable
  skills rather than fabricating direct experience.
- If the Job Description is missing or very short, write a more general but still
  tailored letter based on the job title/company name only, and note this in "highlights".

Job Description:
${jobDescription}

Resume:
${resumeText}`
}
