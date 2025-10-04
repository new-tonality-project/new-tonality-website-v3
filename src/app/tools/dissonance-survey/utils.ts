import { centsToRatio } from 'sethares-dissonance'


export function getIntervalFrequencies(interval: number, medianFrequency: number) {
  const ratio = centsToRatio(interval)
  const f_1 = medianFrequency / Math.sqrt(1 + ratio)
  const f_2 = ratio * f_1
  return [f_1, f_2] as [number, number]
}
