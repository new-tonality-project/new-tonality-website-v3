'use client'

import { useMemo, useCallback } from 'react'
import { AdditiveSynth } from 'new-tonality-web-synth'

export function useSynth() {
  const synth = useMemo(() => {
    return new AdditiveSynth({
      spectrum: [{ partials: [{ rate: 1, amplitude: 0.2 }] }],
      audioContext: new AudioContext(),
      adsr: { attack: 0.1, sustain: 1, release: 0.1, decay: 0 },
    })
  }, [])

  const playInterval = useCallback(([f1, f2]: [number, number]) => {
    synth.releaseAll()

    synth.play({ pitch: f1, velocity: 0.5 })
    synth.play({ pitch: f2, velocity: 0.5 })

    setTimeout(() => {
      synth.releaseAll()
    }, 1000)
  }, [synth])

  return {
    synth,
    playInterval,
  }
}
