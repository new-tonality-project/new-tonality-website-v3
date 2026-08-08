'use client'

import { useState } from 'react'
import { Button, DragNumberInput } from '@/components'
import { SidebarSection } from '@/components/SidebarSection'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import {
  DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  DEFAULT_PERIODS,
} from '../utils'
import {
  DEFAULT_SAMPLE_DURATION_SECONDS,
  MAX_SAMPLE_DURATION_SECONDS,
  MIN_SAMPLE_DURATION_SECONDS,
  downloadBeatingAnalysisSamples,
} from '../downloadSamples'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function GeneralParams() {
  const { settings, update } = useBeatingAnalysisSettings()
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
    <div className="flex flex-col gap-6">
      <SidebarSection title="Playback">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Hold{' '}
          <kbd className="rounded border border-zinc-300 px-1.5 py-0.5 font-sans text-xs dark:border-zinc-600">
            P
          </kbd>{' '}
          to play the combined reference and interval spectrum (real harmonics
          only).
        </p>
      </SidebarSection>

      <SidebarSection title="Sample download">
        <DragNumberInput
          defaultValue={DEFAULT_SAMPLE_DURATION_SECONDS}
          value={sampleDurationSeconds}
          min={MIN_SAMPLE_DURATION_SECONDS}
          max={MAX_SAMPLE_DURATION_SECONDS}
          minStep={0.5}
          valueRange={10}
          label="Duration (s)"
          onChange={setSampleDurationSeconds}
        />
        <Button
          type="button"
          variant="secondary"
          disabled={isDownloading}
          onClick={() => {
            void handleDownload()
          }}
          className="w-full"
        >
          {isDownloading ? 'Preparing zip…' : 'Download samples'}
        </Button>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Downloads a zip with reference, interval, and combined WAV files.
        </p>
      </SidebarSection>

      <SidebarSection title="Dissonance curve">
        <DragNumberInput
          defaultValue={DEFAULT_DISSONANCE_CURVE_MIN_CENTS}
          value={settings.dissonanceCurveMinCents}
          min={0}
          max={4800}
          minStep={1}
          valueRange={100}
          whole
          label="Min cents"
          onChange={(dissonanceCurveMinCents) =>
            update({ dissonanceCurveMinCents })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_DISSONANCE_CURVE_MAX_CENTS}
          value={settings.dissonanceCurveMaxCents}
          min={0}
          max={4800}
          minStep={1}
          valueRange={100}
          whole
          label="Max cents"
          onChange={(dissonanceCurveMaxCents) =>
            update({ dissonanceCurveMaxCents })
          }
        />
      </SidebarSection>

      <SidebarSection title="Waveshape">
        <DragNumberInput
          defaultValue={DEFAULT_PERIODS}
          value={settings.periods}
          min={1}
          max={1000}
          minStep={1}
          valueRange={100}
          whole
          label="Waveshape periods"
          onChange={(periods) => update({ periods })}
        />
        <CheckboxField>
          <Checkbox
            checked={settings.showEnvelope}
            onChange={(showEnvelope) => update({ showEnvelope })}
          />
          <Label className="text-sm">Show envelope</Label>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            checked={settings.showRms}
            onChange={(showRms) => update({ showRms })}
          />
          <Label className="text-sm">Show RMS</Label>
        </CheckboxField>
      </SidebarSection>
    </div>
  )
}
