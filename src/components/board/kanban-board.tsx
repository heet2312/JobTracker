'use client'

import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragStartEvent } from '@dnd-kit/core'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { KanbanCardSkeleton } from './kanban-card-skeleton'
import { KANBAN_STAGES } from '@/lib/constants/kanban-stages'
import { useKanban } from '@/lib/hooks/use-kanban'
import { ScrollArea } from '@/components/ui/scroll-area'

export function KanbanBoard() {
  const { stages, isLoading, activeCard, handleDragStart, handleDragEnd } = useKanban()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {KANBAN_STAGES.slice(0, 6).map((s) => (
          <div key={s.id} className="w-64 shrink-0 rounded-xl border bg-card/50 p-3 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            {Array.from({ length: 2 }).map((_, i) => <KanbanCardSkeleton key={i} />)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e: DragStartEvent) => handleDragStart(String(e.active.id))}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4 min-w-max">
          {KANBAN_STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              label={stage.label}
              color={stage.color}
              applications={stages?.[stage.id] ?? []}
            />
          ))}
        </div>
      </ScrollArea>
      <DragOverlay>
        {activeCard ? <KanbanCard application={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
