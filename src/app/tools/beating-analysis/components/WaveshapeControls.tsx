'use client'

import { useState } from 'react'
import { Button, DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@/components/catalyst/fieldset'
import {
  DEFAULT_SAMPLE_DURATION_SECONDS,
  MAX_SAMPLE_DURATION_SECONDS,
  MIN_SAMPLE_DURATION_SECONDS,
  downloadBeatingAnalysisSamples,
} from '../audio'
import { DEFAULT_BEATING_ANALYSIS_STATE } from './useSyncBeatingAnalysisSettings'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

function ControlDivider() {
  return (
    <div
      className="hidden h-4 w-px shrink-0 bg-zinc-300 sm:block dark:bg-zinc-600"
      aria-hidden
    />
  )
}

export function WaveshapeControls() {
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
    <div className="flex flex-wrap items-center gap-3">
      <DragNumberInput
        variant="mini"
        className="ml-0"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.dissonanceCurveMinCents}
        value={settings.dissonanceCurveMinCents}
        min={0}
        max={Math.max(0, settings.dissonanceCurveMaxCents - 1)}
        minStep={1}
        valueRange={100}
        whole
        label="Min (cents)"
        onChange={(dissonanceCurveMinCents) =>
          update({ dissonanceCurveMinCents })
        }
      />
      <DragNumberInput
        variant="mini"
        className="ml-0"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.dissonanceCurveMaxCents}
        value={settings.dissonanceCurveMaxCents}
        min={Math.min(4800, settings.dissonanceCurveMinCents + 1)}
        max={4800}
        minStep={1}
        valueRange={100}
        whole
        label="Max (cents)"
        onChange={(dissonanceCurveMaxCents) =>
          update({ dissonanceCurveMaxCents })
        }
      />
      <ControlDivider />
      <DragNumberInput
        variant="mini"
        className="ml-0"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.periods}
        value={settings.periods}
        min={1}
        max={1000}
        minStep={1}
        valueRange={100}
        whole
        label="Waveshape periods"
        onChange={(periods) => update({ periods })}
      />
      <CheckboxField className="gap-x-2!">
        <Checkbox
          checked={settings.showEnvelope}
          onChange={(showEnvelope) => update({ showEnvelope })}
        />
        <Label className="text-sm font-normal">Envelope</Label>
      </CheckboxField>
      <CheckboxField className="gap-x-2!">
        <Checkbox
          checked={settings.showRms}
          onChange={(showRms) => update({ showRms })}
        />
        <Label className="text-sm font-normal">RMS</Label>
      </CheckboxField>
      <ControlDivider />
      <DragNumberInput
        variant="mini"
        className="ml-0"
        defaultValue={DEFAULT_SAMPLE_DURATION_SECONDS}
        value={sampleDurationSeconds}
        min={MIN_SAMPLE_DURATION_SECONDS}
        max={MAX_SAMPLE_DURATION_SECONDS}
        minStep={1}
        valueRange={10}
        label="Sample (s)"
        onChange={setSampleDurationSeconds}
      />
      <Button
        type="button"
        variant="primary"
        disabled={isDownloading}
        onClick={() => {
          void handleDownload()
        }}
        className="px-2 py-1 text-xs font-medium"
      >
        {isDownloading ? 'Preparing…' : 'Download'}
      </Button>
    </div>
  )
}
