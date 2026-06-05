'use client'

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { KanbanCard } from './kanban-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'
import type { IApplication } from '@/types'

interface KanbanColumnProps {
  id: string
  label: string
  color: string
  applications: IApplication[]
  onAddCard?: () => void
}

export function KanbanColumn({ id, label, color, applications, onAddCard }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const ids = applications.map((a) => a._id)

  return (
    <div
      className={cn(
        'flex flex-col w-64 shrink-0 rounded-xl border bg-card/50 transition-colors',
        isOver && 'border-primary/60 bg-primary/5'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-semibold">{label}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
            {applications.length}
          </Badge>
        </div>
        {onAddCard && (
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onAddCard}>
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1 max-h-[calc(100vh-14rem)]">
        <SortableContext id={id} items={ids} strategy={verticalListSortingStrategy}>
          <div ref={setNodeRef} className="p-2 space-y-2 min-h-[60px]">
            {applications.map((app) => (
              <KanbanCard key={app._id} application={app} />
            ))}
          </div>
        </SortableContext>
      </ScrollArea>
    </div>
  )
}
