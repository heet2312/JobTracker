export function buildResumeOptimizePrompt(jobDescription: string, resumeText: string): string {
  return `You are an expert resume writer and ATS optimization specialist. Optimize the provided resume for the specific job description.

Return a JSON object with exactly this structure:
{
  "summary": string,
  "experience": [
    {
      "company": string,
      "title": string,
      "startDate": string,
      "endDate": string,
      "description": string,
      "achievements": string[]
    }
  ],
  "skills": string[],
  "keywords": string[],
  "changes": string[],
  "atsScore": number (0-100),
  "wordCount": number,
  "fullText": string
}

Optimization rules:
- Tailor the summary to match the role
- Reorder/reword bullet points to highlight relevant experience
- Inject missing keywords naturally (never stuff)
- Use action verbs and quantify achievements where possible
- Keep it ATS-friendly (no tables, minimal formatting in fullText)
- changes: list 3-7 specific changes made and why
- fullText: complete plain-text version ready to paste

Job Description:
${jobDescription}

Original Resume:
${resumeText}`
}
