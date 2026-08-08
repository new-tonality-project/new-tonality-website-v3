import { zipSync } from 'fflate'
import { AdditiveSynth, type Partial, type Spectrum } from 'new-tonality-web-synth'
import type { SpectrumHarmonic } from '@/lib/spectrum'
import { frequencyFromCents } from './utils'

export const DEFAULT_SAMPLE_DURATION_SECONDS = 2
export const MIN_SAMPLE_DURATION_SECONDS = 0.5
export const MAX_SAMPLE_DURATION_SECONDS = 30

export const SYNTH_ADSR = { attack: 0.05, decay: 0, sustain: 1, release: 0.1 }
export const SYNTH_VELOCITY = 0.35

const AUDIBLE_MIN_HZ = 20
const AUDIBLE_MAX_HZ = 20000

export type SynthSpectrumParams = {
  referenceFrequency: number
  intervalCents: number
  amplitude: number
  phaseDegrees: number
  referenceHarmonics: SpectrumHarmonic[]
  intervalHarmonics: SpectrumHarmonic[]
}

export type PlaybackMode = 'reference' | 'interval' | 'combined'

export const PLAYBACK_KEY_MODES = {
  KeyR: 'reference',
  KeyI: 'interval',
  KeyP: 'combined',
} as const satisfies Record<string, PlaybackMode>

function isAudible(rate: number) {
  return rate >= AUDIBLE_MIN_HZ && rate <= AUDIBLE_MAX_HZ
}

function toSpectrum(partials: Partial[]): Spectrum {
  return [{ partials: partials.filter((partial) => isAudible(partial.rate)) }]
}

export function buildReferenceSynthSpectrum({
  referenceFrequency,
  referenceHarmonics,
}: Pick<
  SynthSpectrumParams,
  'referenceFrequency' | 'referenceHarmonics'
>): Spectrum {
  return toSpectrum(
    referenceHarmonics.map((harmonic) => ({
      rate: referenceFrequency * harmonic.ratio,
      amplitude: harmonic.amplitude,
    })),
  )
}

export function buildIntervalSynthSpectrum({
  referenceFrequency,
  intervalCents,
  amplitude,
  phaseDegrees,
  intervalHarmonics,
}: SynthSpectrumParams): Spectrum {
  const intervalFrequency = frequencyFromCents(
    referenceFrequency,
    intervalCents,
  )
  const phaseRad = (phaseDegrees * Math.PI) / 180

  return toSpectrum(
    intervalHarmonics.map((harmonic) => ({
      rate: intervalFrequency * harmonic.ratio,
      amplitude: amplitude * harmonic.amplitude,
      phase: harmonic.ratio * phaseRad,
    })),
  )
}

export function buildCombinedSynthSpectrum(
  params: SynthSpectrumParams,
): Spectrum {
  const reference = buildReferenceSynthSpectrum(params)[0]?.partials ?? []
  const interval = buildIntervalSynthSpectrum(params)[0]?.partials ?? []
  return toSpectrum([...reference, ...interval])
}

export function buildSynthSpectrumForMode(
  mode: PlaybackMode,
  params: SynthSpectrumParams,
): Spectrum {
  switch (mode) {
    case 'reference':
      return buildReferenceSynthSpectrum(params)
    case 'interval':
      return buildIntervalSynthSpectrum(params)
    case 'combined':
      return buildCombinedSynthSpectrum(params)
  }
}

function audioBufferToWav(buffer: AudioBuffer): Uint8Array {
  const sampleRate = buffer.sampleRate
  const samples = buffer.getChannelData(0)
  const dataLength = samples.length * 2
  const wav = new ArrayBuffer(44 + dataLength)
  const view = new DataView(wav)

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + dataLength, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, dataLength, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i] ?? 0))
    view.setInt16(
      offset,
      sample < 0 ? sample * 0x8000 : sample * 0x7fff,
      true,
    )
    offset += 2
  }

  return new Uint8Array(wav)
}

async function generateWavSample({
  synth,
  spectrum,
  duration,
}: {
  synth: AdditiveSynth
  spectrum: Spectrum
  duration: number
}) {
  synth.update(spectrum)
  const audioBuffer = await synth.generateSample({
    duration,
    fundamental: 1,
  })
  return audioBufferToWav(audioBuffer)
}

function triggerDownload(filename: string, data: Uint8Array) {
  const bytes = new Uint8Array(data)
  const blob = new Blob([bytes], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function downloadBeatingAnalysisSamples({
  durationSeconds,
  ...params
}: SynthSpectrumParams & { durationSeconds: number }) {
  if (typeof AudioContext === 'undefined') {
    throw new Error('AudioContext is not available in this environment')
  }

  const duration = Math.max(
    MIN_SAMPLE_DURATION_SECONDS,
    Math.min(MAX_SAMPLE_DURATION_SECONDS, durationSeconds),
  )
  const audioContext = new AudioContext()
  const synth = new AdditiveSynth({
    spectrum: buildCombinedSynthSpectrum(params),
    audioContext,
    adsr: SYNTH_ADSR,
  })

  try {
    const reference = await generateWavSample({
      synth,
      spectrum: buildReferenceSynthSpectrum(params),
      duration,
    })
    const interval = await generateWavSample({
      synth,
      spectrum: buildIntervalSynthSpectrum(params),
      duration,
    })
    const combined = await generateWavSample({
      synth,
      spectrum: buildCombinedSynthSpectrum(params),
      duration,
    })

    const archive = zipSync({
      'reference.wav': reference,
      'interval.wav': interval,
      'combined.wav': combined,
    })

    triggerDownload('beating-analysis-samples.zip', archive)
  } finally {
    await audioContext.close()
  }
}
