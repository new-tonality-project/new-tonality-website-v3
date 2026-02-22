import { MusicalBackground } from '@/lib/types'
import type { SETHARES_DISSONANCE_PARAMS } from 'sethares-dissonance'

export type ChartSettings = Partial<typeof SETHARES_DISSONANCE_PARAMS> & {
  showAverage: boolean
  showExponentialFit: boolean
  userBackground: MusicalBackground | undefined
}

