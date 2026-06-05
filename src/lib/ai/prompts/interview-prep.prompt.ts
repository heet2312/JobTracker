export function buildInterviewPrepPrompt(jobDescription: string, resumeText: string, company: string): string {
  return `You are an expert interview coach. Generate comprehensive interview preparation material for this role.

Return a JSON object with exactly this structure:
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
- technicalQuestions: 5-8 questions specific to the tech stack and requirements
- behavioralQuestions: 5-7 STAR-format questions (leadership, conflict, failure, achievement)
- companyQuestions: 4-6 questions specific to ${company}'s known culture/products/challenges
- systemDesignTopics: 3-5 relevant design topics if applicable (empty array for non-senior roles)
- sampleAnswer: 2-3 sentence framework answer (not a full answer, just structure)
- readinessScore: estimate based on resume match
- prepPlan: 5-7 ordered action items for the candidate to prepare

Job Description:
${jobDescription}

Resume:
${resumeText}

Company: ${company}`
}
