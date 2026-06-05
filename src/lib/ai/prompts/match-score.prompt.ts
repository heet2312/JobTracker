export function buildMatchScorePrompt(jobDescription: string, resumeText: string): string {
  return `You are an expert ATS (Applicant Tracking System) and career counselor. Analyze the match between the job description and resume.

Return a JSON object with exactly this structure:
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

Scoring guidelines:
- overallScore: weighted average of all dimensions
- skillsScore: % of required skills present in resume
- experienceScore: years/level match
- atsScore: keyword density and formatting compatibility
- keywordScore: % of job keywords found in resume
- applicationProbability: likelihood of passing initial screening
- suggestions: 3-5 specific, actionable improvements

Job Description:
${jobDescription}

Resume:
${resumeText}`
}
