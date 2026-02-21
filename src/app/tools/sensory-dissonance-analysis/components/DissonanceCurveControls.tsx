'use client'

import { SETHARES_DISSONANCE_PARAMS } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import type { ChartSettings } from './types'


type DissonanceCurveControlsProps = {
  value: ChartSettings
  onChange: (params: ChartSettings) => void
}

export function DissonanceCurveControls({
  value,
  onChange,
}: DissonanceCurveControlsProps) {
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-2 lg:max-w-none">
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            checked={value.showExponentialFit}
            onChange={(checked) =>
              onChange(
                {
                  ...value,
                  showExponentialFit: checked,
                }
              )
            }
          />
          <Label>Show exponential fit</Label>
        </CheckboxField>
      </CheckboxGroup>

      <DragNumberInput
        defaultValue={SETHARES_DISSONANCE_PARAMS.x_star}
        value={value.x_star}
        min={0.001}
        max={1}
        valueRange={0.1}
        label="x*"
        onChange={(x_star) => onChange({ ...value, x_star })}
      />
    </div>
  )
}
