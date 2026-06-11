'use client'

import 'driver.js/dist/driver.css'
import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { TOUR_PAGES, TOTAL_STEPS, getTourGlobalStart } from '@/lib/tour/steps'
import { completeOnboardingAction } from '@/lib/actions/user.actions'
import type { Driver } from 'driver.js'

// ─── localStorage helpers ─────────────────────────────────────────────────────

const stateKey = (uid: string) => `tour_state_${uid}`
const doneKey = (uid: string) => `tour_done_${uid}`

function readState(uid: string): { pageIdx: number } | null {
  try {
    const raw = localStorage.getItem(stateKey(uid))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeState(uid: string, pageIdx: number) {
  localStorage.setItem(stateKey(uid), JSON.stringify({ pageIdx }))
}

function markDone(uid: string) {
  localStorage.removeItem(stateKey(uid))
  localStorage.setItem(doneKey(uid), '1')
}

// ─── DOM helper ──────────────────────────────────────────────────────────────

function waitForEl(selector: string, ms = 3000): Promise<boolean> {
  if (document.querySelector(selector)) return Promise.resolve(true)
  return new Promise((resolve) => {
    const obs = new MutationObserver(() => {
      if (document.querySelector(selector)) { obs.disconnect(); resolve(true) }
    })
    obs.observe(document.body, { childList: true, subtree: true })
    setTimeout(() => { obs.disconnect(); resolve(false) }, ms)
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PageTour() {
  const { user, isLoaded } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const driverRef = useRef<Driver | null>(null)
  const isNavRef = useRef(false)
  const pathnameRef = useRef(pathname)

  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  const complete = useCallback((uid: string) => {
    markDone(uid)
    driverRef.current?.destroy()
    driverRef.current = null
    completeOnboardingAction().catch(() => {})
  }, [])

  const runPage = useCallback(async (uid: string, pageIdx: number) => {
    const page = TOUR_PAGES[pageIdx]
    if (!page) { complete(uid); return }

    const found = await waitForEl(page.steps[0].selector)
    // If element not found or user navigated away, bail
    if (!found || pathnameRef.current !== page.path) return

    // Destroy any existing driver instance
    driverRef.current?.destroy()

    const { driver } = await import('driver.js')
    const globalStart = getTourGlobalStart(pageIdx)
    const isFirstPage = pageIdx === 0
    const isLastPage = pageIdx === TOUR_PAGES.length - 1

    const dObj = driver({
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 8,
      popoverClass: 'tour-popover',
      showProgress: false,

      onNextClick: () => {
        if (dObj.isLastStep()) {
          isNavRef.current = true
          dObj.destroy()
          if (isLastPage) {
            complete(uid)
          } else {
            const next = pageIdx + 1
            writeState(uid, next)
            router.push(TOUR_PAGES[next].path)
          }
        } else {
          dObj.moveNext()
        }
      },

      onPrevClick: () => {
        if (dObj.isFirstStep()) {
          if (pageIdx > 0) {
            isNavRef.current = true
            const prev = pageIdx - 1
            writeState(uid, prev)
            dObj.destroy()
            router.push(TOUR_PAGES[prev].path)
          }
        } else {
          dObj.movePrevious()
        }
      },

      onCloseClick: () => {
        if (!isNavRef.current) complete(uid)
        isNavRef.current = false
      },

      onDestroyStarted: () => {
        dObj.destroy()
      },

      steps: page.steps.map((step, i) => {
        const g = globalStart + i
        const isVeryFirst = isFirstPage && i === 0
        const isVeryLast = g === TOTAL_STEPS - 1

        return {
          element: step.selector,
          popover: {
            title: step.title,
            description: `${step.description}<div class="tour-step-counter">${g + 1} / ${TOTAL_STEPS}</div>`,
            side: step.side ?? 'bottom',
            align: step.align ?? 'start',
            showButtons: isVeryFirst
              ? (['next', 'close'] as const)
              : (['previous', 'next', 'close'] as const),
            prevBtnText: '← Back',
            nextBtnText: isVeryLast ? 'Done ✓' : 'Next →',
          },
        }
      }),
    })

    driverRef.current = dObj
    dObj.drive()
  }, [router, complete])

  // Main effect — runs on mount and on every pathname change
  useEffect(() => {
    if (!isLoaded || !user) return

    const done = localStorage.getItem(doneKey(user.id))
    const state = readState(user.id)

    // First-ever visit: start tour
    if (!done && !state) {
      writeState(user.id, 0)
      if (pathname !== TOUR_PAGES[0].path) {
        router.push(TOUR_PAGES[0].path)
        return
      }
    }

    const current = readState(user.id)
    if (!current) return

    const target = TOUR_PAGES[current.pageIdx]
    if (!target) { complete(user.id); return }

    if (pathname === target.path) {
      const t = setTimeout(() => runPage(user.id, current.pageIdx), 500)
      return () => clearTimeout(t)
    } else {
      router.push(target.path)
    }
  }, [isLoaded, user, pathname, router, runPage, complete])

  // Replay from Settings
  useEffect(() => {
    function onReplay() {
      if (!user) return
      driverRef.current?.destroy()
      driverRef.current = null
      localStorage.removeItem(doneKey(user.id))
      writeState(user.id, 0)
      if (pathnameRef.current !== TOUR_PAGES[0].path) {
        router.push(TOUR_PAGES[0].path)
      } else {
        runPage(user.id, 0)
      }
    }
    window.addEventListener('tour:replay', onReplay)
    return () => window.removeEventListener('tour:replay', onReplay)
  }, [user, router, runPage])

  // Cleanup on unmount
  useEffect(() => () => { driverRef.current?.destroy() }, [])

  return null
}
