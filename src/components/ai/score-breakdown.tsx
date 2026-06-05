import { Progress } from '@/components/ui/progress'
import { scoreToColor } from '@/lib/utils/format'

interface ScoreBreakdownProps {
  breakdown: Record<string, number>
}

const LABELS: Record<string, string> = {
  technicalSkills: 'Technical Skills',
  softSkills: 'Soft Skills',
  experienceYears: 'Experience',
  industryFit: 'Industry Fit',
  locationMatch: 'Location Match',
  titleMatch: 'Title Match',
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      {Object.entries(breakdown).map(([key, value]) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">{LABELS[key] ?? key}</span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: scoreToColor(value) }}>
              {Math.round(value)}%
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${value}%`, backgroundColor: scoreToColor(value) }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
