'use client'

import { DragNumberInput, SettingsIcon } from '@/components'
import { Button } from '@/components/catalyst/button'
import { DEFAULT_BEATING_ANALYSIS_STATE } from './useSyncBeatingAnalysisSettings'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function IntervalControls({
  dissonanceOpen,
  onToggleDissonance,
  spectrumOpen,
  onToggleSpectrum,
}: {
  dissonanceOpen: boolean
  onToggleDissonance: () => void
  spectrumOpen: boolean
  onToggleSpectrum: () => void
}) {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DragNumberInput
        variant="outlined"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.intervalCents}
        value={settings.intervalCents}
        min={0}
        max={4800}
        minStep={1}
        valueRange={100}
        label="Interval (cents)"
        onChange={(intervalCents) => update({ intervalCents })}
      />
      <DragNumberInput
        variant="outlined"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.amplitude}
        value={settings.amplitude}
        min={0}
        max={1}
        minStep={0.01}
        valueRange={1}
        label="Amplitude"
        onChange={(amplitude) => update({ amplitude })}
      />
      <DragNumberInput
        variant="outlined"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.phaseDegrees}
        value={settings.phaseDegrees}
        min={-360}
        max={360}
        minStep={1}
        valueRange={360}
        whole
        label="Phase (°)"
        onChange={(phaseDegrees) => update({ phaseDegrees })}
      />
      <Button
        type="button"
        className="flex cursor-pointer items-center gap-x-2"
        plain
        onClick={onToggleDissonance}
        aria-pressed={dissonanceOpen}
      >
        Dissonance
        <SettingsIcon className="size-4" />
      </Button>
      <Button
        type="button"
        className="flex cursor-pointer items-center gap-x-2"
        plain
        onClick={onToggleSpectrum}
        aria-pressed={spectrumOpen}
      >
        Spectrum
        <SettingsIcon className="size-4" />
      </Button>
    </div>
  )
}
