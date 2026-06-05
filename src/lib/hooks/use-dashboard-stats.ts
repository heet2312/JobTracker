'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardStats } from '@/lib/actions/application.actions'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const result = await getDashboardStats()
      if (!result.success) throw new Error(result.error)
      return result.data!
    },
    staleTime: 60 * 1000,
  })
}
