'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getResumes, createResume, setMasterResume, deleteResume } from '@/lib/actions/resume.actions'

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const result = await getResumes()
      if (!result.success) throw new Error(result.error)
      return result.data!
    },
  })
}

export function useCreateResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createResume,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resumes'] }),
  })
}

export function useSetMasterResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: setMasterResume,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resumes'] }),
  })
}

export function useDeleteResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['resumes'] }),
  })
}
