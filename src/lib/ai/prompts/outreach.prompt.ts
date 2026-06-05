export function buildOutreachPrompt(jobTitle: string, company: string, resumeSummary: string): string {
  return `You are an expert job search strategist. Create 5 outreach messages for a candidate applying to ${jobTitle} at ${company}.

Return a JSON object with exactly this structure:
{
  "recruiterEmail": { "subject": string, "body": string },
  "hiringManagerEmail": { "subject": string, "body": string },
  "linkedinConnect": { "message": string },
  "linkedinFollowup": { "message": string },
  "coldOutreach": { "subject": string, "body": string }
}

Rules:
- recruiterEmail: 150-200 words, professional, highlight top 2-3 qualifications
- hiringManagerEmail: 200-250 words, show knowledge of company/role, value proposition
- linkedinConnect: <300 chars, friendly, specific reason to connect
- linkedinFollowup: <300 chars, reference no response, gentle persistence
- coldOutreach: 150-200 words, for when you don't have a specific contact

Candidate summary:
${resumeSummary}

Target role: ${jobTitle} at ${company}`
}
