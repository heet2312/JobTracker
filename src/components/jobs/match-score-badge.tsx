import { Badge } from '@/components/ui/badge'
import { scoreToColor, scoreToLabel } from '@/lib/utils/format'

interface MatchScoreBadgeProps {
  score: number
  size?: 'sm' | 'default'
}

export function MatchScoreBadge({ score, size = 'default' }: MatchScoreBadgeProps) {
  const color = scoreToColor(score)
  const label = scoreToLabel(score)

  return (
    <Badge
      variant="outline"
      className={size === 'sm' ? 'text-[10px] px-1.5 py-0 h-4' : 'text-xs'}
      style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
    >
      {score}% {label}
    </Badge>
  )
}
