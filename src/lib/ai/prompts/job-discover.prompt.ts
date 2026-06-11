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
  return `You are an expert job market analyst and career strategist. Based on the
candidate's profile, generate 10 distinct job-search targets to help them find REAL
openings — these are search strategies and example employer profiles, not live job
postings.

Return ONLY a raw JSON array (no markdown code fences, no commentary before or after) with exactly
this structure:
[
  {
    "title": string,
    "exampleEmployerType": string,
    "exampleCompanies": string[],
    "location": string,
    "estimatedSalaryRange": string,
    "matchScore": number (0-100),
    "matchReason": string,
    "missingSkills": string[],
    "priorityScore": number (0-100),
    "whyApply": string,
    "searchQuery": string,
    "isLiveListing": false
  }
]

Rules:
- title: a specific job title variant worth searching for
- exampleEmployerType: describe the kind of company (e.g. "Series B fintech startup,
  remote-first, 50-200 employees") rather than asserting a specific opening exists
- exampleCompanies: 2-4 REAL, well-known companies that are plausible employers for
  this role/industry combination based on their general hiring patterns — do NOT
  claim any of them currently has this exact opening
- estimatedSalaryRange: typical market range for this title/level/location, framed
  as a market estimate (e.g. "$120k-$150k typical market range"), not a specific offer
- matchReason: 1-2 sentences why this target fits the candidate's profile
- missingSkills: 1-3 skills the candidate should acquire or highlight for this target
- priorityScore: overall recommendation priority (consider salary, match, growth)
- whyApply: compelling 1-sentence pitch for pursuing this search target
- searchQuery: exact, ready-to-paste search string for LinkedIn/Indeed/RemoteOK that
  the candidate can run right now to find real, current openings
- isLiveListing: always false — this signals to the UI that these are AI-generated
  suggestions, not scraped/verified job postings
- Vary titles, locations (respecting remote preference), and employer types across
  the 10 entries — do not repeat the same role/company combination

Candidate Profile:
- Target Roles: ${preferences.targetRoles.join(', ')}
- Skills: ${preferences.skills.join(', ')}
- Target Locations: ${preferences.targetLocations.join(', ')}
- Remote Preference: ${preferences.remotePreference}
- Experience Level: ${preferences.experienceLevel}
- Industries: ${preferences.industries.join(', ')}
- Salary Range: ${preferences.targetSalaryMin ?? 'not specified'} - ${preferences.targetSalaryMax ?? 'not specified'}`
}
