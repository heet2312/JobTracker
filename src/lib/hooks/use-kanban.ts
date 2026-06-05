'use client'

import { useState, useCallback } from 'react'
import type { DragEndEvent } from '@dnd-kit/core'
import type { IApplication, KanbanStage } from '@/types'
import { useApplicationsByStage, useUpdateApplicationStage } from './use-applications'

export function useKanban() {
  const { data: stages, isLoading } = useApplicationsByStage()
  const updateStage = useUpdateApplicationStage()
  const [activeCard, setActiveCard] = useState<IApplication | null>(null)

  const handleDragStart = useCallback(
    (id: string) => {
      if (!stages) return
      for (const apps of Object.values(stages)) {
        const found = apps.find((a) => a._id === id)
        if (found) { setActiveCard(found); break }
      }
    },
    [stages]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null)
      const { active, over } = event
      if (!over || !stages) return
      const sourceStage = (active.data.current?.sortable?.containerId ?? '') as KanbanStage
      const targetStage = (over.data.current?.sortable?.containerId ?? over.id) as KanbanStage
      if (!targetStage || sourceStage === targetStage) return
      const targetApps = stages[targetStage] ?? []
      updateStage.mutate({
        applicationId: String(active.id),
        stage: targetStage,
        position: targetApps.length,
      })
    },
    [stages, updateStage]
  )

  return { stages, isLoading, activeCard, handleDragStart, handleDragEnd }
}
