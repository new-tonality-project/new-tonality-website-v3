'use client'

import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@/components/catalyst/fieldset'
import { DEFAULT_BEATING_ANALYSIS_STATE } from './useSyncBeatingAnalysisSettings'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function WaveshapeControls() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DragNumberInput
        variant="outlined"
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
        <Label className="text-sm font-normal">Show envelope</Label>
      </CheckboxField>
      <CheckboxField className="gap-x-2!">
        <Checkbox
          checked={settings.showRms}
          onChange={(showRms) => update({ showRms })}
        />
        <Label className="text-sm font-normal">Show RMS</Label>
      </CheckboxField>
    </div>
  )
}
