'use client'

import { SETHARES_DISSONANCE_PARAMS } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
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
    <div className="flex items-center gap-6 flex-wrap w-full lg:max-w-none">
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
          <Label className="text-sm">Show exponential fit</Label>
        </CheckboxField>

      <DragNumberInput
        defaultValue={SETHARES_DISSONANCE_PARAMS.x_star}
        value={value.x_star}
        disabled={!value.showExponentialFit}
        min={0.001}
        max={1}
        valueRange={0.1}
        label="x*"
        onChange={(x_star) => onChange({ ...value, x_star })}
      />
    </div>
  )
}
