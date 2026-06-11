export function buildMatchScorePrompt(jobDescription: string, resumeText: string): string {
  return `You are an expert ATS (Applicant Tracking System) and career counselor. Analyze the match between the job description and resume.

Return ONLY a raw JSON object (no markdown code fences, no commentary before or after) with exactly this structure:
{
  "overallScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "atsScore": number (0-100),
  "keywordScore": number (0-100),
  "applicationProbability": number (0-100),
  "matchedSkills": string[],
  "missingSkills": string[],
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "scoreBreakdown": {
    "technicalSkills": number,
    "softSkills": number,
    "experienceYears": number,
    "industryFit": number,
    "locationMatch": number,
    "titleMatch": number
  }
}

Scoring guidelines (be critical and realistic — avoid clustering everything in the
70-85 range):
- 90-100: candidate meets nearly all requirements, exceptional fit (should be rare)
- 75-89: strong match, only minor gaps
- 50-74: meets some core requirements but has clear gaps
- 25-49: weak match, missing multiple core requirements
- 0-24: largely unrelated role/skillset
- skillsScore: % of required skills explicitly evidenced in the resume
- experienceScore: years/seniority level match against job requirements
- atsScore: keyword density and formatting compatibility (penalize resumes that are
  image-based, table-heavy, or missing standard section headers if evident from text)
- keywordScore: % of job-description keywords found in resume
- applicationProbability: realistic likelihood of passing initial automated/recruiter
  screening — should track closely with overallScore and atsScore
- locationMatch / titleMatch: if the job description does not specify a location or
  the resume's target title isn't clear, score 50 (neutral) rather than guessing
- suggestions: 3-5 specific, actionable improvements (reference exact missing keywords
  or skills, not generic advice)
- Base all scores strictly on the text provided — do not assume skills or experience
  that aren't stated in the resume

Job Description:
${jobDescription}

Resume:
${resumeText}`
}
