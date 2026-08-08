'use client'

import { DragNumberInput } from '@/components'
import { SidebarSection } from '@/components/SidebarSection'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import {
  DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  DEFAULT_PERIODS,
} from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function GeneralParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-6">
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
