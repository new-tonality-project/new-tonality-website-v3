'use client'

import { DragNumberInput } from '@/components'
import { DEFAULT_REFERENCE_FREQUENCY, DEFAULT_REAL_HARMONICS_NUMBER } from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function ReferenceSpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-3">
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
        defaultValue={DEFAULT_REAL_HARMONICS_NUMBER}
        value={settings.realHarmonicsNumber}
        min={1}
        max={20}
        minStep={1}
        valueRange={10}
        whole
        label="Real harmonics"
        onChange={(realHarmonicsNumber) => update({ realHarmonicsNumber })}
      />
    </div>
  )
}
