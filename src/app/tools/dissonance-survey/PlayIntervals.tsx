'use client'

import { useMemo } from 'react'
import { AdditiveSynth } from 'new-tonality-web-synth'

export function PlayIntervals(props: {
  intervalFrequencies: { interval: number; frequencies: [number, number] }[]
}) {
  const synth = useMemo(() => {
    return new AdditiveSynth({
      spectrum: [{ partials: [{ rate: 1, amplitude: 0.2 }] }],
      audioContext: new AudioContext(),
      adsr: { attack: 0.1, sustain: 1, release: 0.1, decay: 0 },
    })
  }, [])

  function playInterval([f1, f2]: [number, number]) {
    synth.releaseAll()

    synth.play({ pitch: f1, velocity: 0.5 })
    synth.play({ pitch: f2, velocity: 0.5 })

    setTimeout(() => {
      synth.releaseAll()
    }, 1000)
  }

  return (
    <div className="flex gap-2">
      {props.intervalFrequencies.map(({ interval, frequencies }) => (
        <button
          className="cursor-pointer rounded border px-4 py-1 hover:bg-slate-200"
          key={interval}
          onClick={() => playInterval(frequencies)}
        >
          {interval}
        </button>
      ))}
    </div>
  )
}
