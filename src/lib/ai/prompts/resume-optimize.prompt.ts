export function buildResumeOptimizePrompt(jobDescription: string, resumeText: string): string {
  return `You are an expert resume writer and ATS optimization specialist. Optimize the provided resume for the specific job description.

Return ONLY a raw JSON object (no markdown code fences, no commentary before or after) with exactly this structure:
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
- Tailor the summary to match the role, using only experience present in the original resume
- Reorder/reword bullet points to highlight the most relevant existing experience —
  do not invent new responsibilities or projects
- HARD CONSTRAINT: Do not add skills, tools, technologies, certifications, or
  achievements to "skills" or "experience" that are not present, implied, or
  reasonably inferable from the original resume. If a job-required skill is missing,
  do not add it — instead note it in "changes" as a gap the candidate should address
  separately
- Inject relevant keywords from the job description only where they accurately
  describe existing experience — never keyword-stuff
- Use strong action verbs and quantify achievements only where numbers already exist
  in the original resume, or where the candidate's existing description allows a
  reasonable, clearly-labeled estimate
- Keep it ATS-friendly (no tables, minimal formatting in fullText)
- changes: list 3-7 specific changes made and why, including any required skills
  that could NOT be added because they're not in the candidate's background
- atsScore: score the OPTIMIZED resume against the scoring guidance below, not the original
  - 90-100: excellent keyword/format alignment
  - 70-89: good alignment, minor gaps remain
  - 50-69: moderate alignment
  - Below 50: significant gaps remain even after optimization
- fullText: complete plain-text version ready to paste

Job Description:
${jobDescription}

Original Resume:
${resumeText}`
}
