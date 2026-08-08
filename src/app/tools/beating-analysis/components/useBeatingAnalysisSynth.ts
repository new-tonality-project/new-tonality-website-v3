'use client'

import { useEffect, useRef } from 'react'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { buildCombinedSynthSpectrum } from '../downloadSamples'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

const SYNTH_ADSR = { attack: 0.05, decay: 0, sustain: 1, release: 0.1 }

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName
  return (
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useBeatingAnalysisSynth() {
  const { settings } = useBeatingAnalysisSettings()
  const synthRef = useRef<AdditiveSynth | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const isPlayingRef = useRef(false)
  const settingsRef = useRef(settings)

  settingsRef.current = settings

  useEffect(() => {
    const ensureSynth = () => {
      if (synthRef.current) {
        return synthRef.current
      }

      if (typeof AudioContext === 'undefined') {
        return null
      }

      const audioContext = new AudioContext()
      const synth = new AdditiveSynth({
        spectrum: buildCombinedSynthSpectrum(settingsRef.current),
        audioContext,
        adsr: SYNTH_ADSR,
      })
      audioContextRef.current = audioContext
      synthRef.current = synth
      return synth
    }

    const startPlaying = async () => {
      const synth = ensureSynth()
      const audioContext = audioContextRef.current
      if (!synth || !audioContext || isPlayingRef.current) {
        return
      }

      synth.update(buildCombinedSynthSpectrum(settingsRef.current))

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      synth.play({ pitch: 1, velocity: 0.35, voiceId: 'beating-analysis' })
      isPlayingRef.current = true
    }

    const stopPlaying = () => {
      if (!synthRef.current || !isPlayingRef.current) {
        return
      }

      synthRef.current.releaseAll()
      isPlayingRef.current = false
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.code !== 'KeyP' ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      void startPlaying()
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'KeyP') {
        return
      }

      event.preventDefault()
      stopPlaying()
    }

    const onBlur = () => {
      stopPlaying()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      stopPlaying()
      void audioContextRef.current?.close()
      audioContextRef.current = null
      synthRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!synthRef.current || !isPlayingRef.current) {
      return
    }

    synthRef.current.update(
      buildCombinedSynthSpectrum({
        referenceFrequency: settings.referenceFrequency,
        intervalCents: settings.intervalCents,
        amplitude: settings.amplitude,
        phaseDegrees: settings.phaseDegrees,
        harmonics: settings.harmonics,
      }),
    )
  }, [
    settings.amplitude,
    settings.harmonics,
    settings.intervalCents,
    settings.phaseDegrees,
    settings.referenceFrequency,
  ])
}
