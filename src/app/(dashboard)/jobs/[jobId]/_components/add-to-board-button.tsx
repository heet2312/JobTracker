'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { KanbanSquare, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createApplication } from '@/lib/actions/application.actions'
import { KANBAN_STAGES } from '@/lib/constants/kanban-stages'
import type { IApplication, KanbanStage } from '@/types'

interface AddToBoardButtonProps {
  jobId: string
  application: IApplication | null
}

const QUICK_STAGES: KanbanStage[] = ['saved', 'interested', 'applied']

export function AddToBoardButton({ jobId, application }: AddToBoardButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (application) {
    const stage = KANBAN_STAGES.find((s) => s.id === application.stage)
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => router.push('/board')}
      >
        <Check className="h-4 w-4 text-green-500" />
        <span
          className="text-xs font-medium"
          style={{ color: stage?.color }}
        >
          {stage?.label ?? application.stage}
        </span>
      </Button>
    )
  }

  async function addToBoard(stage: KanbanStage) {
    setLoading(true)
    const result = await createApplication({
      jobId,
      stage,
      status: 'active',
      priority: 'medium',
    })
    setLoading(false)
    if (result.success) {
      toast.success(`Added to board as "${KANBAN_STAGES.find((s) => s.id === stage)?.label}"`)
      router.refresh()
    } else {
      toast.error(result.error ?? 'Failed to add to board')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={loading} className="gap-2">
          <KanbanSquare className="h-4 w-4" />
          {loading ? 'Adding...' : 'Add to Board'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Add as stage
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {QUICK_STAGES.map((stageId) => {
          const stage = KANBAN_STAGES.find((s) => s.id === stageId)!
          return (
            <DropdownMenuItem
              key={stageId}
              onClick={() => addToBoard(stageId)}
              className="gap-2 cursor-pointer"
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: stage.color }}
              />
              {stage.label}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">More stages</DropdownMenuLabel>
        {KANBAN_STAGES.filter((s) => !QUICK_STAGES.includes(s.id as KanbanStage)).map((stage) => (
          <DropdownMenuItem
            key={stage.id}
            onClick={() => addToBoard(stage.id as KanbanStage)}
            className="gap-2 cursor-pointer"
          >
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            {stage.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
