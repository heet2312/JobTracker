'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCommandPalette } from './use-command-palette'
import { ROUTES } from '@/lib/constants/routes'

export function useKeyboardShortcuts() {
  const router = useRouter()
  const { toggle: togglePalette } = useCommandPalette()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey

      if (meta && e.key === 'k') {
        e.preventDefault()
        togglePalette()
      } else if (meta && e.key === 'n') {
        e.preventDefault()
        router.push(ROUTES.IMPORT)
      } else if (meta && e.key === 'b') {
        e.preventDefault()
        router.push(ROUTES.BOARD)
      } else if (meta && e.key === 'd') {
        e.preventDefault()
        router.push(ROUTES.DASHBOARD)
      } else if (meta && e.key === '/') {
        e.preventDefault()
        const search = document.querySelector<HTMLInputElement>('[data-search]')
        search?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [router, togglePalette])
}
