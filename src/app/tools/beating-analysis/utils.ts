import { Spectrum } from 'tuning-core'

export const DEFAULT_REFERENCE_FREQUENCY = 440
export const DEFAULT_PERIODS = 50
export const DEFAULT_PHASE_DEGREES = 0
export const ENVELOPE_WINDOW_PERIODS = 2
export const MAX_REFERENCE_PERIOD_GRID_LINES = 12
export const DISSONANCE_CURVE_START_RATIO = 1
export const DISSONANCE_CURVE_END_RATIO = 4

export function ratioToCents(ratio: number) {
  return (1200 * Math.log2(ratio))
}

export const DISSONANCE_CURVE_MAX_CENTS = ratioToCents(DISSONANCE_CURVE_END_RATIO)

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

/** Pure-tone spectrum passed to DissonanceCurve as context/complement (becomes SpectrumWithLoudness internally). */
export function createPureToneSpectrum(frequency: number, amplitude: number) {
  return new Spectrum().add(frequency, amplitude, 0)
}

function getReferencePeriodGridStep(periods: number) {
  const minStep = Math.ceil(periods / MAX_REFERENCE_PERIOD_GRID_LINES)

  for (const step of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) {
    if (step >= minStep) {
      return step
    }
  }

  return minStep
}

export function getReferencePeriodGridTicks(periods: number, durationMs: number) {
  const periodMs = durationMs / periods
  const stepPeriods = getReferencePeriodGridStep(periods)
  const ticks: number[] = []

  for (let period = 0; period <= periods; period += stepPeriods) {
    ticks.push(period * periodMs)
  }

  if (ticks[ticks.length - 1] !== durationMs) {
    ticks.push(durationMs)
  }

  return ticks
}

function getWindowSamples(samplesPerReferencePeriod: number, windowPeriods: number) {
  return Math.max(1, Math.round((samplesPerReferencePeriod * windowPeriods) / 2))
}

export function computePeakEnvelope(
  sum: WaveformPoint[],
  samplesPerReferencePeriod: number,
  windowPeriods: number,
) {
  const windowSamples = getWindowSamples(samplesPerReferencePeriod, windowPeriods)
  const upper: WaveformPoint[] = []
  const lower: WaveformPoint[] = []

  for (let i = 0; i < sum.length; i++) {
    const start = Math.max(0, i - windowSamples)
    const end = Math.min(sum.length - 1, i + windowSamples)
    let upperPeak = -Infinity
    let lowerPeak = Infinity

    for (let j = start; j <= end; j++) {
      const sample = sum[j][1]
      upperPeak = Math.max(upperPeak, sample)
      lowerPeak = Math.min(lowerPeak, sample)
    }

    const timeMs = sum[i][0]
    upper.push([timeMs, upperPeak])
    lower.push([timeMs, lowerPeak])
  }

  return { upper, lower }
}

export function computeRmsEnvelope(
  sum: WaveformPoint[],
  samplesPerReferencePeriod: number,
  windowPeriods: number,
) {
  const windowSamples = getWindowSamples(samplesPerReferencePeriod, windowPeriods)
  const rms: WaveformPoint[] = []

  for (let i = 0; i < sum.length; i++) {
    const start = Math.max(0, i - windowSamples)
    const end = Math.min(sum.length - 1, i + windowSamples)
    let sumSquares = 0
    let count = 0

    for (let j = start; j <= end; j++) {
      sumSquares += sum[j][1] ** 2
      count++
    }

    const value = Math.sqrt(sumSquares / count)
    rms.push([sum[i][0], value])
  }

  return rms
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
  const sampleCount = Math.max(1000, Math.round(periods * 20))

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

  const samplesPerReferencePeriod = sampleCount / periods

  return {
    reference,
    intervalTone,
    sum,
    samplesPerReferencePeriod,
    intervalFrequency,
    durationMs: durationSec * 1000,
  }
}
