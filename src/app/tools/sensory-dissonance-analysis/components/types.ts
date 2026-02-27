import { MusicalBackground } from '@/lib/types'
import type { DissonanceParams } from 'sethares-dissonance'

export type ChartSettings = Required<DissonanceParams> & {
  showAverage: boolean
  showExponentialFit: boolean
  userBackground: MusicalBackground | undefined
  start?: number
  end?: number
}

