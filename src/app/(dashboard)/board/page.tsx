import { KanbanBoard } from '@/components/board/kanban-board'

export default function BoardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Board</h1>
        <p className="text-muted-foreground text-sm mt-1">Drag and drop applications between stages</p>
      </div>
      <KanbanBoard />
    </div>
  )
}
