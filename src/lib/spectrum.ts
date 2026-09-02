import { Spectrum } from 'tuning-core'

export type SpectrumHarmonic = {
  ratio: number
  amplitude: number
}

export const DEFAULT_STRETCH_FACTOR = 2

export const DEFAULT_SPECTRUM_HARMONICS: SpectrumHarmonic[] = [
  { ratio: 1, amplitude: 1 },
]

export function createStretchedHarmonics(
  count: number,
  stretchFactor: number,
): SpectrumHarmonic[] {
  const safeCount = Math.max(1, Math.floor(count))
  const safeStretch =
    Number.isFinite(stretchFactor) && stretchFactor > 1
      ? stretchFactor
      : DEFAULT_STRETCH_FACTOR

  return Spectrum.stretched(safeCount, 1, safeStretch)
    .getHarmonics()
    .map((harmonic) => ({
      ratio: harmonic.frequencyNum,
      amplitude: harmonic.amplitude,
    }))
}

export function getDefaultHarmonic(
  index: number,
  stretchFactor = DEFAULT_STRETCH_FACTOR,
): SpectrumHarmonic {
  return (
    createStretchedHarmonics(index + 1, stretchFactor)[index] ?? {
      ratio: 1,
      amplitude: 1,
    }
  )
}

export function createDefaultHarmonicSeries(count: number): SpectrumHarmonic[] {
  return createStretchedHarmonics(count, DEFAULT_STRETCH_FACTOR)
}

export function getMaxHarmonicRatio(harmonics: SpectrumHarmonic[]) {
  return Math.max(...harmonics.map((harmonic) => harmonic.ratio), 1)
}

export function cloneHarmonics(harmonics: SpectrumHarmonic[]): SpectrumHarmonic[] {
  return harmonics.map((harmonic) => ({ ...harmonic }))
}

export function parseHarmonicsJson(value: string | undefined | null) {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null
    }

    const harmonics = parsed
      .map((item) => {
        if (
          typeof item !== 'object' ||
          item === null ||
          !('ratio' in item) ||
          !('amplitude' in item)
        ) {
          return null
        }

        const ratio = Number(item.ratio)
        const amplitude = Number(item.amplitude)

        if (!Number.isFinite(ratio) || !Number.isFinite(amplitude)) {
          return null
        }

        return { ratio, amplitude }
      })
      .filter((item): item is SpectrumHarmonic => item !== null)

    return harmonics.length > 0 ? harmonics : null
  } catch {
    return null
  }
}

export function serializeHarmonicsJson(harmonics: SpectrumHarmonic[]) {
  return JSON.stringify(harmonics)
}
