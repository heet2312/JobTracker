import type { KanbanStage } from '@/types'

export const KANBAN_STAGES = [
  { id: 'saved' as KanbanStage, label: 'Saved', color: '#71717a' },
  { id: 'interested' as KanbanStage, label: 'Interested', color: '#a78bfa' },
  { id: 'applied' as KanbanStage, label: 'Applied', color: '#60a5fa' },
  { id: 'assessment' as KanbanStage, label: 'Assessment', color: '#38bdf8' },
  { id: 'screening' as KanbanStage, label: 'Screening', color: '#34d399' },
  { id: 'interview_1' as KanbanStage, label: 'Interview Round 1', color: '#4ade80' },
  { id: 'interview_2' as KanbanStage, label: 'Interview Round 2', color: '#a3e635' },
  { id: 'final' as KanbanStage, label: 'Final Interview', color: '#facc15' },
  { id: 'offer' as KanbanStage, label: 'Offer', color: '#fb923c' },
  { id: 'accepted' as KanbanStage, label: 'Accepted', color: '#22c55e' },
  { id: 'rejected' as KanbanStage, label: 'Rejected', color: '#ef4444' },
  { id: 'ghosted' as KanbanStage, label: 'Ghosted', color: '#6b7280' },
  { id: 'withdrawn' as KanbanStage, label: 'Withdrawn', color: '#d1d5db' },
] as const

export const KANBAN_STAGE_MAP = Object.fromEntries(
  KANBAN_STAGES.map((s) => [s.id, s])
) as Record<KanbanStage, (typeof KANBAN_STAGES)[number]>
