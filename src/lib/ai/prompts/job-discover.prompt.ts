export function buildJobDiscoverPrompt(preferences: {
  targetRoles: string[]
  skills: string[]
  targetLocations: string[]
  remotePreference: string
  experienceLevel: string
  industries: string[]
  targetSalaryMin?: number
  targetSalaryMax?: number
}): string {
  return `You are an expert job market analyst and career strategist. Based on the candidate's profile, generate 10 highly relevant job recommendations.

Return a JSON array with exactly this structure:
[
  {
    "title": string,
    "company": string,
    "location": string,
    "estimatedSalary": string,
    "matchScore": number (0-100),
    "matchReason": string,
    "missingSkills": string[],
    "priorityScore": number (0-100),
    "whyApply": string,
    "searchQuery": string
  }
]

Rules:
- Generate realistic companies (mix of big tech, startups, mid-size)
- Vary locations based on preferences
- estimatedSalary: range like "$120k-$150k"
- matchReason: 1-2 sentences why this is a good fit
- missingSkills: 1-3 skills the candidate should acquire for this role
- priorityScore: overall recommendation priority (consider salary, match, growth)
- whyApply: compelling 1-sentence pitch
- searchQuery: exact search string to use on LinkedIn/Indeed

Candidate Profile:
- Target Roles: ${preferences.targetRoles.join(', ')}
- Skills: ${preferences.skills.join(', ')}
- Target Locations: ${preferences.targetLocations.join(', ')}
- Remote Preference: ${preferences.remotePreference}
- Experience Level: ${preferences.experienceLevel}
- Industries: ${preferences.industries.join(', ')}
- Salary Range: ${preferences.targetSalaryMin ?? 'not specified'} - ${preferences.targetSalaryMax ?? 'not specified'}`
}
