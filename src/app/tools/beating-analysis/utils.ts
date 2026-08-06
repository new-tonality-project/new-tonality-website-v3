export const DEFAULT_REFERENCE_FREQUENCY = 440
export const DEFAULT_PERIODS = 50
export const DEFAULT_PHASE_DEGREES = 0

export function frequencyFromCents(baseFrequency: number, cents: number): number {
  return baseFrequency * Math.pow(2, cents / 1200)
}

export type WaveformPoint = [timeMs: number, amplitude: number]

export type WaveformParams = {
  referenceFrequency: number
  periods: number
  intervalCents: number
  amplitude: number
  phaseDegrees: number
}

export function generateWaveforms({
  referenceFrequency,
  periods,
  intervalCents,
  amplitude,
  phaseDegrees,
}: WaveformParams) {
  const durationSec = periods / referenceFrequency
  const intervalFrequency = frequencyFromCents(referenceFrequency, intervalCents)
  const phaseRad = (phaseDegrees * Math.PI) / 180
  const sampleCount = Math.max(1000, Math.round(periods * 40))

  const reference: WaveformPoint[] = []
  const intervalTone: WaveformPoint[] = []
  const sum: WaveformPoint[] = []

  for (let i = 0; i <= sampleCount; i++) {
    const timeSec = (i / sampleCount) * durationSec
    const timeMs = timeSec * 1000
    const referenceSample = Math.sin(2 * Math.PI * referenceFrequency * timeSec)
    const intervalSample =
      amplitude * Math.sin(2 * Math.PI * intervalFrequency * timeSec + phaseRad)

    reference.push([timeMs, referenceSample])
    intervalTone.push([timeMs, intervalSample])
    sum.push([timeMs, referenceSample + intervalSample])
  }

  return {
    reference,
    intervalTone,
    sum,
    intervalFrequency,
    durationMs: durationSec * 1000,
  }
}
