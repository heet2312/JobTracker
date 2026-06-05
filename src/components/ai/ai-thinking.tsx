import { Skeleton } from '@/components/ui/skeleton'

interface AIThinkingProps {
  message?: string
  lines?: number
}

export function AIThinking({ message = 'Analyzing with Gemini...', lines = 4 }: AIThinkingProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-primary animate-pulse">✦</span>
        <span>{message}</span>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-4"
            style={{ width: `${85 - i * 8}%` }}
          />
        ))}
      </div>
    </div>
  )
}
