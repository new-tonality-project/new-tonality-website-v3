import { debounce } from 'lodash-es'
import { centsToRatio } from 'sethares-dissonance'

export function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function clamp(number: number, a: number, b: number) {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  return Math.min(Math.max(number, min), max)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceTransaction<T extends (...args: any[]) => any>(
  callback: T,
) {
  return debounce(callback, 100, { leading: false })
}

export function getIntervalFrequencies(interval: number, meanFrequency: number) {
  const ratio = centsToRatio(interval)
  const f_1 = meanFrequency / Math.sqrt(ratio)
  const f_2 = ratio * f_1
  return [f_1, f_2] as [number, number]
}
