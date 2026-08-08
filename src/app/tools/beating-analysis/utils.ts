import { Spectrum } from 'tuning-core'
import { SpectrumWithLoudness } from 'sethares-dissonance/dist/classes/private/SpectrumWithLoudness.js'
import type { SpectrumHarmonic } from '@/lib/spectrum'
import { getMaxHarmonicRatio } from '@/lib/spectrum'

export const DEFAULT_REFERENCE_FREQUENCY = 440
export const DEFAULT_PERIODS = 50
export const DEFAULT_PHASE_DEGREES = 0
export const BASE_SAMPLES_PER_REFERENCE_PERIOD = 20
export const EXTRA_SAMPLES_PER_REAL_HARMONIC = 10
export const ENVELOPE_WINDOW_PERIODS = 2
export const MAX_REFERENCE_PERIOD_GRID_LINES = 12
export const DISSONANCE_CURVE_START_RATIO = 1
export const DISSONANCE_CURVE_END_RATIO = 4

export function ratioToCents(ratio: number) {
  return 1200 * Math.log2(ratio)
}

export function centsToRatio(cents: number) {
  return Math.pow(2, cents / 1200)
}

export const DEFAULT_REAL_HARMONICS_NUMBER = 1
export const DEFAULT_DISSONANCE_CURVE_MIN_CENTS = 0
export const DEFAULT_DISSONANCE_CURVE_MAX_CENTS = ratioToCents(
  DISSONANCE_CURVE_END_RATIO,
)

export const DISSONANCE_CURVE_MAX_CENTS = ratioToCents(DISSONANCE_CURVE_END_RATIO)

export function frequencyFromCents(baseFrequency: number, cents: number): number {
  return baseFrequency * Math.pow(2, cents / 1200)
}

export function getSamplesPerReferencePeriod(harmonics: SpectrumHarmonic[]) {
  const maxRatio = getMaxHarmonicRatio(harmonics)
  return (
    BASE_SAMPLES_PER_REFERENCE_PERIOD +
    EXTRA_SAMPLES_PER_REAL_HARMONIC * Math.max(0, maxRatio - 1)
  )
}

export const REAL_HARMONICS_ARTIFACT_WARNING_THRESHOLD = 3

export type WaveformPoint = [timeMs: number, amplitude: number]

export type WaveformParams = {
  referenceFrequency: number
  periods: number
  intervalCents: number
  amplitude: number
  phaseDegrees: number
  referenceHarmonics: SpectrumHarmonic[]
  intervalHarmonics: SpectrumHarmonic[]
}

export type SpectrumPartial = {
  cents: number
  amplitude: number
  phantom: boolean
}

/** Tone spectrum passed to DissonanceCurve as context/complement. */
export function createSpectrumFromHarmonics(
  frequency: number,
  harmonics: SpectrumHarmonic[],
  globalAmplitude = 1,
) {
  const spectrum = new Spectrum()

  for (const harmonic of harmonics) {
    spectrum.add(
      frequency * harmonic.ratio,
      harmonic.amplitude * globalAmplitude,
      0,
    )
  }

  return spectrum
}

/** @deprecated Use createSpectrumFromHarmonics instead. */
export function createToneSpectrum(
  frequency: number,
  realHarmonicsNumber: number,
) {
  if (realHarmonicsNumber <= 1) {
    return new Spectrum().add(frequency, 1, 0)
  }

  return Spectrum.harmonic(realHarmonicsNumber, frequency)
}

function scaleSpectrumAmplitude(spectrum: Spectrum, amplitude: number) {
  if (amplitude === 1) {
    return spectrum
  }

  const scaled = new Spectrum()

  for (const harmonic of spectrum.getHarmonics()) {
    scaled.add(
      Number(harmonic.frequency),
      harmonic.amplitude * amplitude,
      harmonic.phase ?? 0,
    )
  }

  return scaled
}

/** Partials after real and phantom harmonics, in cents relative to the reference frequency. */
export function getToneSpectrumPartials(
  referenceFrequency: number,
  centsFromReference: number,
  globalAmplitude: number,
  harmonics: SpectrumHarmonic[],
  phantomHarmonicsNumber: number,
): SpectrumPartial[] {
  const fundamentalFrequency = frequencyFromCents(
    referenceFrequency,
    centsFromReference,
  )
  const toneSpectrum = scaleSpectrumAmplitude(
    createSpectrumFromHarmonics(
      fundamentalFrequency,
      harmonics,
      globalAmplitude,
    ),
    1,
  )
  const phantomCount = phantomHarmonicsNumber + 1
  const phantomHarmonics = SpectrumWithLoudness.harmonic(phantomCount, 1, true)
  const spectrumWithPhantoms = new SpectrumWithLoudness(toneSpectrum).mul(
    phantomHarmonics,
  )

  return spectrumWithPhantoms
    .getHarmonics()
    .map((harmonic) => ({
      cents: ratioToCents(Number(harmonic.frequency) / referenceFrequency),
      amplitude: harmonic.amplitude,
      phantom: harmonic.phantom,
    }))
    .sort((left, right) => left.cents - right.cents)
}

export function getHarmonicsAmplitudeAxisBounds(partials: SpectrumPartial[]) {
  const amplitudes = partials
    .map((partial) => partial.amplitude)
    .filter((amplitude) => amplitude > 0)

  if (amplitudes.length === 0) {
    return {
      min: 0.001,
      max: 1,
    }
  }

  const minAmplitude = Math.min(...amplitudes)
  const maxAmplitude = Math.max(...amplitudes)

  return {
    min: minAmplitude / 10,
    max: maxAmplitude * 2,
  }
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

function sampleHarmonicTone(
  timeSec: number,
  fundamentalFrequency: number,
  harmonics: SpectrumHarmonic[],
  globalAmplitude: number,
  phaseRad: number,
) {
  let sample = 0

  for (const harmonic of harmonics) {
    sample +=
      globalAmplitude *
      harmonic.amplitude *
      Math.sin(
        2 * Math.PI * fundamentalFrequency * harmonic.ratio * timeSec +
          harmonic.ratio * phaseRad,
      )
  }

  return sample
}

export function generateWaveforms({
  referenceFrequency,
  periods,
  intervalCents,
  amplitude,
  phaseDegrees,
  referenceHarmonics,
  intervalHarmonics,
}: WaveformParams) {
  const durationSec = periods / referenceFrequency
  const intervalFrequency = frequencyFromCents(referenceFrequency, intervalCents)
  const samplesPerReferencePeriod = getSamplesPerReferencePeriod([
    ...referenceHarmonics,
    ...intervalHarmonics,
  ])
  const phaseRad = (phaseDegrees * Math.PI) / 180
  const sampleCount = periods * samplesPerReferencePeriod

  const reference: WaveformPoint[] = []
  const intervalTone: WaveformPoint[] = []
  const sum: WaveformPoint[] = []

  for (let i = 0; i <= sampleCount; i++) {
    const timeSec = (i / sampleCount) * durationSec
    const timeMs = timeSec * 1000
    const referenceSample = sampleHarmonicTone(
      timeSec,
      referenceFrequency,
      referenceHarmonics,
      1,
      0,
    )
    const intervalSample = sampleHarmonicTone(
      timeSec,
      intervalFrequency,
      intervalHarmonics,
      amplitude,
      phaseRad,
    )

    reference.push([timeMs, referenceSample])
    intervalTone.push([timeMs, intervalSample])
    sum.push([timeMs, referenceSample + intervalSample])
  }

  return {
    reference,
    intervalTone,
    sum,
    samplesPerReferencePeriod,
    intervalFrequency,
    durationMs: durationSec * 1000,
  }
}
