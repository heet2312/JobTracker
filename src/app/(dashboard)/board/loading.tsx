export default function BoardLoading() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-64 shrink-0 rounded-xl border bg-card/50 animate-pulse">
          <div className="h-10 border-b px-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
          <div className="p-2 space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="h-20 rounded-lg bg-muted/50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
