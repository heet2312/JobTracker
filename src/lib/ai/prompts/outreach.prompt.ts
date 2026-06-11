export function buildOutreachPrompt(jobTitle: string, company: string, resumeSummary: string): string {
  return `You are an expert job search strategist. Create 5 outreach messages for a candidate applying to ${jobTitle} at ${company}.

Return ONLY a raw JSON object (no markdown code fences, no commentary before or after) with exactly this structure:
{
  "recruiterEmail": { "subject": string, "body": string },
  "hiringManagerEmail": { "subject": string, "body": string },
  "linkedinConnect": { "message": string },
  "linkedinFollowup": { "message": string },
  "coldOutreach": { "subject": string, "body": string }
}

Rules:
- recruiterEmail: 150-200 words, professional, highlight top 2-3 qualifications
- hiringManagerEmail: 200-250 words, show genuine interest in the role and team,
  value proposition
- linkedinConnect: <300 chars, friendly, specific reason to connect
- linkedinFollowup: <300 chars, reference no response, gentle persistence
- coldOutreach: 150-200 words, for when you don't have a specific contact
- GROUNDING: Only cite qualifications, projects, and experience present in the
  candidate summary below. Do not invent metrics or accomplishments.
- Do not fabricate specific details about ${company}'s products, team structure, or
  recent news unless they are widely known public facts you are confident about —
  prefer general enthusiasm ("your team's mission", "the work you're doing in X
  space") over invented specifics.
- Use placeholders like "[Hiring Manager's Name]" where a name is needed but not provided.

Candidate summary:
${resumeSummary}

Target role: ${jobTitle} at ${company}`
}
