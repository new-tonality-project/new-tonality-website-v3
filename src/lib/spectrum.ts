export type SpectrumHarmonic = {
  ratio: number
  amplitude: number
}

export const DEFAULT_SPECTRUM_HARMONICS: SpectrumHarmonic[] = [
  { ratio: 1, amplitude: 1 },
]

export function createDefaultHarmonicSeries(count: number): SpectrumHarmonic[] {
  const safeCount = Math.max(1, Math.floor(count))

  return Array.from({ length: safeCount }, (_, index) => {
    const ratio = index + 1
    return { ratio, amplitude: 1 / ratio }
  })
}

export function getNextHarmonic(harmonics: SpectrumHarmonic[]): SpectrumHarmonic {
  const nextRatio =
    harmonics.length > 0
      ? Math.max(...harmonics.map((harmonic) => harmonic.ratio)) + 1
      : 1

  return { ratio: nextRatio, amplitude: 1 / nextRatio }
}

export function getMaxHarmonicRatio(harmonics: SpectrumHarmonic[]) {
  return Math.max(...harmonics.map((harmonic) => harmonic.ratio), 1)
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
