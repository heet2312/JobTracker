'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

const STORAGE_KEY_PREFIX = 'ai_api_key_'

/**
 * Manages the user's custom AI provider API key in localStorage only.
 * The key is NEVER sent to or stored in our database — this hook is the
 * single source of truth for the key on the client side.
 */
export function useLocalApiKey() {
  const { userId } = useAuth()
  const storageKey = userId ? `${STORAGE_KEY_PREFIX}${userId}` : null

  const [isSet, setIsSet] = useState(false)

  useEffect(() => {
    if (!storageKey) return
    setIsSet(Boolean(localStorage.getItem(storageKey)))
  }, [storageKey])

  /** Persist a new key. Pass empty string to clear. */
  function saveKey(key: string) {
    if (!storageKey) return
    if (key) {
      localStorage.setItem(storageKey, key)
      setIsSet(true)
    } else {
      localStorage.removeItem(storageKey)
      setIsSet(false)
    }
  }

  /**
   * Read the raw key synchronously — use this right before calling a server
   * action so you're always reading the latest value, not stale React state.
   */
  function getKey(): string {
    if (!storageKey) return ''
    return localStorage.getItem(storageKey) ?? ''
  }

  return { isSet, saveKey, getKey }
}
