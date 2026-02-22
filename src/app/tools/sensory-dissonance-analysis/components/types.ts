import { MusicalBackground } from '@/lib/types'
import type { DissonanceParams } from 'sethares-dissonance'

export type ChartSettings = Partial<DissonanceParams> & {
  showAverage: boolean
  showExponentialFit: boolean
  showSecondOrderBeating: boolean
  userBackground: MusicalBackground | undefined
}

