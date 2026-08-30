import { MusicalBackground } from '@/lib/types'
import type { DissonanceParamsState } from '@/lib/dissonanceParams'

export type SensoryDissonanceAnalysisState = {
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

export type ChartSettings = SensoryDissonanceAnalysisState & DissonanceParamsState
