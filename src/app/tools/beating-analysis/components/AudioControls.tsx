'use client'

import { useState } from 'react'
import { Button, DragNumberInput } from '@/components'
import {
  DEFAULT_SAMPLE_DURATION_SECONDS,
  MAX_SAMPLE_DURATION_SECONDS,
  MIN_SAMPLE_DURATION_SECONDS,
  downloadBeatingAnalysisSamples,
} from '../audio'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 font-sans text-xs dark:border-zinc-600">
      {children}
    </kbd>
  )
}

export function AudioControls() {
  const { settings } = useBeatingAnalysisSettings()
  const [sampleDurationSeconds, setSampleDurationSeconds] = useState(
    DEFAULT_SAMPLE_DURATION_SECONDS,
  )
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) {
      return
    }

    setIsDownloading(true)
    try {
      await downloadBeatingAnalysisSamples({
        durationSeconds: sampleDurationSeconds,
        referenceFrequency: settings.referenceFrequency,
        intervalCents: settings.intervalCents,
        amplitude: settings.amplitude,
        phaseDegrees: settings.phaseDegrees,
        harmonics: settings.harmonics,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Hold <Kbd>R</Kbd> and/or <Kbd>I</Kbd> for reference and interval (together
        = combined), or <Kbd>P</Kbd> for combined alone.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <DragNumberInput
          variant="outlined"
          defaultValue={DEFAULT_SAMPLE_DURATION_SECONDS}
          value={sampleDurationSeconds}
          min={MIN_SAMPLE_DURATION_SECONDS}
          max={MAX_SAMPLE_DURATION_SECONDS}
          minStep={0.5}
          valueRange={10}
          label="Sample duration (s)"
          onChange={setSampleDurationSeconds}
        />
        <Button
          type="button"
          variant="primary"
          disabled={isDownloading}
          onClick={() => {
            void handleDownload()
          }}
          className="py-2.5 text-base font-semibold"
        >
          {isDownloading ? 'Preparing zip…' : 'Download samples'}
        </Button>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Zip archive with reference, interval, and combined WAV files.
      </p>
    </div>
  )
}
