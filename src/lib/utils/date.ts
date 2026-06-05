import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns'

export function relativeTime(date: Date | string | undefined | null): string {
  if (!date) return 'Unknown'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 'Unknown'
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDate(date: Date | string | undefined | null, fmt = 'MMM d, yyyy'): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return '—'
  return format(d, fmt)
}

export function formatDateShort(date: Date | string | undefined | null): string {
  return formatDate(date, 'MMM d')
}

export function daysSince(date: Date | string | undefined | null): number {
  if (!date) return 0
  const d = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(d)) return 0
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
}

export function isoNow(): string {
  return new Date().toISOString()
}
