'use client'

import {
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { SidebarSection } from '@/components/SidebarSection'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function DissonanceParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-6">
      <SidebarSection title="Phantom harmonics">
        <DragNumberInput
          defaultValue={DEFAULT_PHANTOM_HARMONICS_NUMBER}
          value={settings.phantomHarmonicsNumber}
          min={0}
          max={20}
          minStep={1}
          valueRange={10}
          whole
          label="Count"
          onChange={(phantomHarmonicsNumber) =>
            update({ phantomHarmonicsNumber })
          }
        />
      </SidebarSection>

      <SidebarSection title="Beating contributions">
        <DragNumberInput
          defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude}
          value={settings.secondOrderBeatingContribution}
          min={0}
          max={1}
          minStep={0.01}
          valueRange={0.5}
          label="2nd order"
          onChange={(secondOrderBeatingContribution) =>
            update({ secondOrderBeatingContribution })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude}
          value={settings.thirdOrderBeatingContribution}
          min={0}
          max={1}
          minStep={0.01}
          valueRange={0.5}
          label="3rd order"
          onChange={(thirdOrderBeatingContribution) =>
            update({ thirdOrderBeatingContribution })
          }
        />
      </SidebarSection>
    </div>
  )
}
