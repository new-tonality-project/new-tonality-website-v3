'use client'

import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import {
  DEFAULT_PERIODS,
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REFERENCE_FREQUENCY,
} from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function BeatingControls() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Controls
      </h2>

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
        <DragNumberInput
          defaultValue={DEFAULT_REFERENCE_FREQUENCY}
          value={settings.referenceFrequency}
          min={20}
          max={2000}
          minStep={1}
          valueRange={200}
          whole
          label="Reference (Hz)"
          onChange={(referenceFrequency) => update({ referenceFrequency })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_PERIODS}
          value={settings.periods}
          min={1}
          max={1000}
          minStep={1}
          valueRange={100}
          whole
          label="Periods"
          onChange={(periods) => update({ periods })}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
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
      </div>
    </div>
  )
}
