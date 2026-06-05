'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getApplicationsByStage,
  createApplication,
  updateApplicationStage,
} from '@/lib/actions/application.actions'
import type { KanbanStage } from '@/types'

export function useApplicationsByStage() {
  return useQuery({
    queryKey: ['applications', 'by-stage'],
    queryFn: async () => {
      const result = await getApplicationsByStage()
      if (!result.success) throw new Error(result.error)
      return result.data!
    },
  })
}

export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}

export function useUpdateApplicationStage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      applicationId,
      stage,
      position,
    }: {
      applicationId: string
      stage: KanbanStage
      position: number
    }) => updateApplicationStage(applicationId, stage, position),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  })
}
