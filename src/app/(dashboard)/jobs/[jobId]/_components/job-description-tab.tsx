import type { IJob } from '@/types'

interface JobDescriptionTabProps {
  job: IJob
}

export function JobDescriptionTab({ job }: JobDescriptionTabProps) {
  if (!job.rawDescription) {
    return (
      <p className="text-muted-foreground text-sm">No job description available.</p>
    )
  }

  const keywords = [...(job.requiredSkills ?? []), ...(job.techStack ?? []), ...(job.keywords ?? [])]

  function highlightKeywords(text: string): React.ReactNode {
    if (keywords.length === 0) return text
    const regex = new RegExp(`\\b(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{part}</mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground bg-transparent border-0 p-0">
        {highlightKeywords(job.rawDescription)}
      </pre>
    </div>
  )
}
