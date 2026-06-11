export function buildInterviewPrepPrompt(jobDescription: string, resumeText: string, company: string): string {
  return `You are an expert interview coach. Generate comprehensive interview preparation material for this role.

Return ONLY a raw JSON object (no markdown code fences, no commentary before or after) with exactly this structure:
{
  "technicalQuestions": [
    { "question": string, "category": string, "difficulty": "easy"|"medium"|"hard", "hints": string[], "sampleAnswer": string }
  ],
  "behavioralQuestions": [
    { "question": string, "category": string, "difficulty": "easy"|"medium"|"hard", "hints": string[], "sampleAnswer": string }
  ],
  "companyQuestions": [
    { "question": string, "category": string, "difficulty": "easy"|"medium"|"hard", "hints": string[], "sampleAnswer": string }
  ],
  "systemDesignTopics": string[],
  "readinessScore": number (0-100),
  "prepPlan": string[]
}

Rules:
- technicalQuestions: 5-8 questions specific to the tech stack and requirements in the
  Job Description
- behavioralQuestions: 5-7 STAR-format questions (leadership, conflict, failure, achievement)
- companyQuestions: 4-6 questions about ${company}. Only reference specific products,
  culture, or news you are confident about from well-known public information. If you
  are not confident ${company} is a well-known company, ask general "why this company /
  what attracts you to this type of organization" style questions instead of inventing
  specifics about products or culture.
- systemDesignTopics: 3-5 relevant design topics if applicable (empty array for non-senior
  or non-engineering roles)
- sampleAnswer: 2-3 sentence framework answer (structure/approach, not a full answer)
- readinessScore: compare resume against job requirements.
  90-100 = candidate exceeds nearly all requirements (rare).
  70-89 = strong match, minor gaps.
  50-69 = meets baseline but has notable gaps to address.
  Below 50 = significant gaps; prepPlan should focus on closing them.
- prepPlan: 5-7 ordered, concrete action items (e.g. "Practice explaining X project
  using STAR format", not generic advice like "be confident")

Job Description:
${jobDescription}

Resume:
${resumeText}

Company: ${company}`
}
