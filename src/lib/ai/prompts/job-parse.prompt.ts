export function buildJobParsePrompt(description: string): string {
  return `You are an expert job description parser. Extract structured information from the following job description.

Return a JSON object with exactly this structure:
{
  "title": string,
  "company": string,
  "companyWebsite": string,
  "location": string,
  "locationType": "remote" | "hybrid" | "onsite",
  "salaryMin": number | null,
  "salaryMax": number | null,
  "salaryCurrency": string,
  "employmentType": string,
  "experienceRequired": string,
  "seniorityLevel": string,
  "department": string,
  "industry": string,
  "requiredSkills": string[],
  "preferredSkills": string[],
  "techStack": string[],
  "responsibilities": string[],
  "benefits": string[],
  "keywords": string[],
  "postedDate": string | null,
  "applicationDeadline": string | null
}

Rules:
- Extract only what is explicitly stated. Use empty strings/arrays for missing info.
- salaryMin/salaryMax should be annual numbers in the currency found (default USD).
- keywords: extract 10-20 important terms for ATS matching.
- requiredSkills vs preferredSkills: required are mandatory, preferred are nice-to-have.
- locationType: infer from "remote", "hybrid", "on-site/onsite" mentions.
- seniorityLevel: infer from title/requirements (intern/junior/mid/senior/staff/principal/executive).

Job Description:
${description}`
}
