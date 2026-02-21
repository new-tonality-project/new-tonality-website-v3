import { MusicalBackground } from '@/lib/types'

export type ChartSettings = {
  showAverage: boolean
  showExponentialFit: boolean
  x_star: number
  userBackground: MusicalBackground | undefined
}

