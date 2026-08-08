'use client'

import { DEFAULT_PHANTOM_HARMONICS_NUMBER } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function DissonanceParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-3">
      <DragNumberInput
        defaultValue={DEFAULT_PHANTOM_HARMONICS_NUMBER}
        value={settings.phantomHarmonicsNumber}
        min={0}
        max={20}
        minStep={1}
        valueRange={10}
        whole
        label="Phantom harmonics"
        onChange={(phantomHarmonicsNumber) =>
          update({ phantomHarmonicsNumber })
        }
      />
    </div>
  )
}
