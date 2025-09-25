'use client'

import { useMemo } from 'react'
import { SurveyIntervals } from '@/classes'
import { useSynth } from './useSynth'


export function Survey(props: { medianFrequency: number }) {
  const intervals = useMemo(() => {
    return new SurveyIntervals()
  }, [])

  const { playInterval } = useSynth()

  return (
    <div className="flex gap-2">
      {intervals.getShuffledFrequencies(props.medianFrequency).map(({ interval, frequencies }) => (
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
