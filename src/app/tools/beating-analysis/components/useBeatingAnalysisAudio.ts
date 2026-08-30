'use client'

import { useEffect, useRef } from 'react'
import { AdditiveSynth } from 'new-tonality-web-synth'
import {
  PLAYBACK_KEY_MODES,
  SYNTH_ADSR,
  SYNTH_VELOCITY,
  buildSynthSpectrumForMode,
  masterGainFromVolume,
  type PlaybackMode,
} from '../audio'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

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

function getPlaybackMode(code: string): PlaybackMode | null {
  if (code in PLAYBACK_KEY_MODES) {
    return PLAYBACK_KEY_MODES[code as keyof typeof PLAYBACK_KEY_MODES]
  }
  return null
}

export function useBeatingAnalysisAudio() {
  const { settings } = useBeatingAnalysisSettings()
  const synthRef = useRef<AdditiveSynth | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeModesRef = useRef(new Set<PlaybackMode>())
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
        spectrum: buildSynthSpectrumForMode('combined', settingsRef.current),
        audioContext,
        adsr: SYNTH_ADSR,
      })
      synth.setMasterGain(masterGainFromVolume(settingsRef.current.volume))
      audioContextRef.current = audioContext
      synthRef.current = synth
      return synth
    }

    const releaseMode = (mode: PlaybackMode) => {
      if (!synthRef.current || !activeModesRef.current.has(mode)) {
        return
      }

      synthRef.current.release(mode)
      activeModesRef.current.delete(mode)
    }

    const releaseConflictingModes = (mode: PlaybackMode) => {
      if (mode === 'combined') {
        releaseMode('reference')
        releaseMode('interval')
        return
      }

      releaseMode('combined')
    }

    const startPlaying = async (mode: PlaybackMode) => {
      const synth = ensureSynth()
      const audioContext = audioContextRef.current
      if (!synth || !audioContext || activeModesRef.current.has(mode)) {
        return
      }

      releaseConflictingModes(mode)

      // Update default spectrum for the new voice without touching other voices.
      synth.update(buildSynthSpectrumForMode(mode, settingsRef.current), mode)

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      synth.play({
        pitch: 1,
        velocity: SYNTH_VELOCITY,
        voiceId: mode,
      })
      activeModesRef.current.add(mode)
    }

    const stopPlaying = (mode: PlaybackMode) => {
      releaseMode(mode)
    }

    const stopAll = () => {
      if (!synthRef.current || activeModesRef.current.size === 0) {
        return
      }

      synthRef.current.releaseAll()
      activeModesRef.current.clear()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const mode = getPlaybackMode(event.code)
      if (
        !mode ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return
      }

      event.preventDefault()
      void startPlaying(mode)
    }

    const onKeyUp = (event: KeyboardEvent) => {
      const mode = getPlaybackMode(event.code)
      if (!mode || !activeModesRef.current.has(mode)) {
        return
      }

      event.preventDefault()
      stopPlaying(mode)
    }

    const onBlur = () => {
      stopAll()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      stopAll()
      void audioContextRef.current?.close()
      audioContextRef.current = null
      synthRef.current = null
    }
  }, [])

  useEffect(() => {
    const synth = synthRef.current
    const activeModes = activeModesRef.current
    if (!synth || activeModes.size === 0) {
      return
    }

    const params = {
      referenceFrequency: settings.referenceFrequency,
      intervalCents: settings.intervalCents,
      amplitude: settings.amplitude,
      phaseDegrees: settings.phaseDegrees,
      harmonics: settings.harmonics,
    }

    for (const mode of activeModes) {
      synth.update(buildSynthSpectrumForMode(mode, params), mode)
    }
  }, [
    settings.amplitude,
    settings.harmonics,
    settings.intervalCents,
    settings.phaseDegrees,
    settings.referenceFrequency,
  ])

  useEffect(() => {
    synthRef.current?.setMasterGain(masterGainFromVolume(settings.volume))
  }, [settings.volume])
}
