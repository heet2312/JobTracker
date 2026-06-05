export type FollowUpType = '3-day' | '7-day' | '14-day' | 'post-interview' | 'custom'

const FOLLOWUP_CONTEXT: Record<FollowUpType, string> = {
  '3-day': 'Short follow-up 3 days after submitting application, confirming receipt',
  '7-day': 'Follow-up one week after applying, expressing continued interest',
  '14-day': 'Two-week follow-up, last check-in before moving on',
  'post-interview': 'Thank you note within 24 hours of an interview',
  custom: 'Custom follow-up message',
}

export function buildFollowUpPrompt(
  jobTitle: string,
  company: string,
  contactName: string,
  type: FollowUpType,
  context?: string
): string {
  return `You are an expert job search coach. Generate a follow-up message for a job application.

Context: ${FOLLOWUP_CONTEXT[type]}
${context ? `Additional context: ${context}` : ''}

Return a JSON object with exactly this structure:
{
  "subject": string,
  "content": string,
  "type": string,
  "bestSendTime": string
}

Rules:
- content: 100-150 words, professional but warm
- Do NOT be pushy or desperate
- Reference the specific role and company
- content should be ready to send as-is
- bestSendTime: e.g. "Tuesday or Wednesday morning, 9-11am"
- For post-interview: reference specific topics discussed

Job: ${jobTitle}
Company: ${company}
Contact: ${contactName || 'Hiring Team'}`
}
