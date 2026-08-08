'use client'

import { DragNumberInput } from '@/components'
import { DEFAULT_PHASE_DEGREES } from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function IntervalSpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-3">
      <DragNumberInput
        defaultValue={10}
        value={settings.intervalCents}
        min={0}
        max={4800}
        minStep={1}
        valueRange={100}
        label="Interval (cents)"
        onChange={(intervalCents) => update({ intervalCents })}
      />
      <DragNumberInput
        defaultValue={1}
        value={settings.amplitude}
        min={0}
        max={2}
        minStep={0.01}
        valueRange={1}
        label="Amplitude"
        onChange={(amplitude) => update({ amplitude })}
      />
      <DragNumberInput
        defaultValue={DEFAULT_PHASE_DEGREES}
        value={settings.phaseDegrees}
        min={-360}
        max={360}
        minStep={1}
        valueRange={360}
        whole
        label="Phase (°)"
        onChange={(phaseDegrees) => update({ phaseDegrees })}
      />
    </div>
  )
}
