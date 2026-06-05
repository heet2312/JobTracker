import type { FunnelDataPoint } from '@/types'

interface FunnelChartProps {
  data: FunnelDataPoint[]
}

const STAGE_COLORS: Record<string, string> = {
  applied: '#60a5fa',
  screening: '#34d399',
  interview_1: '#4ade80',
  offer: '#fb923c',
  accepted: '#22c55e',
}

export function FunnelChart({ data }: FunnelChartProps) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="space-y-2">
      {data.map(({ stage, count, percentage }) => (
        <div key={stage}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground capitalize">{stage.replace('_', ' ')}</span>
            <span className="text-xs font-medium tabular-nums">{count}</span>
          </div>
          <div className="h-6 relative overflow-hidden rounded-sm bg-muted/40">
            <div
              className="h-full rounded-sm transition-all duration-500"
              style={{
                width: `${max > 0 ? (count / max) * 100 : 0}%`,
                backgroundColor: STAGE_COLORS[stage] ?? '#71717a',
                opacity: 0.8,
              }}
            />
            {percentage > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-foreground/70">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
