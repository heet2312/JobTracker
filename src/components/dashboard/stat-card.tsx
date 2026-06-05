import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'

interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  className?: string
  valueColor?: string
}

export function StatCard({ label, value, trend, className, valueColor }: StatCardProps) {
  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardContent className="p-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
        <p className="text-4xl font-bold tabular-nums" style={valueColor ? { color: valueColor } : {}}>
          {value}
        </p>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )
}
