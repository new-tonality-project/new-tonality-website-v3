import { MusicalBackground } from '@/lib/types'
import type { DissonanceParams } from 'sethares-dissonance'

export type ChartSettings = Required<DissonanceParams> & {
  showAverage: boolean
  showOtherParticipants: boolean
  showYourResult: boolean
  showExponentialFit: boolean
  showPnLResults: boolean
  userBackground: MusicalBackground | undefined
  /** X-axis and dissonance curve range start (cents) */
  xAxisStart: number
  /** X-axis and dissonance curve range end (cents) */
  xAxisEnd: number
}

