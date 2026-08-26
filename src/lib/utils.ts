import { debounce, round } from 'lodash-es'
import { centsToRatio } from 'tuning-core'
import { MusicalBackground } from './types'

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

export function roundToDecimals(value: number, decimals = 2) {
  return round(value, decimals)
}

export function debounceTransaction<T extends (...args: any[]) => any>(
  callback: T,
) {
  return debounce(callback, 100, { leading: false })
}

export function getIntervalFrequencies(interval: number, meanFrequency: number) {
  const ratio = centsToRatio(interval).valueOf()
  const f_1 = round(meanFrequency / Math.sqrt(ratio), 3)
  const f_2 = round(ratio * f_1, 3)
  return [f_1, f_2] as [number, number]
}

export function parseMusicalBackground(background: string | undefined): MusicalBackground | undefined {
  if (background === MusicalBackground.Microtonalist) return MusicalBackground.Microtonalist
  if (background === MusicalBackground.Musician) return MusicalBackground.Musician
  if (background === MusicalBackground.NaiveListener) return MusicalBackground.NaiveListener
  return undefined
}
