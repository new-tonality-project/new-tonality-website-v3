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
    <div className="flex items-start gap-8 w-full lg:max-w-none pb-8">
      <CheckboxField className="min-w-42">
        <Checkbox
          checked={value.showExponentialFit}
          onChange={(checked) =>
            onChange({
              ...value,
              showExponentialFit: checked,
            })
          }
        />
        <Label className="text-sm">Show theoretical fit</Label>
      </CheckboxField>

      <div className="flex items-center gap-2 flex-wrap grow lg:max-w-none">
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
        <DragNumberInput
          defaultValue={SETHARES_DISSONANCE_PARAMS.b1}
          value={value.b1}
          disabled={!value.showExponentialFit}
          min={0.01}
          minStep={0.01}
          max={10}
          valueRange={1}
          label="b1"
          onChange={(b1) => onChange({ ...value, b1 })}
        />
        <DragNumberInput
          defaultValue={SETHARES_DISSONANCE_PARAMS.b2}
          value={value.b2}
          disabled={!value.showExponentialFit}
          min={0.01}
          minStep={0.01}
          max={10}
          valueRange={1}
          label="b2"
          onChange={(b2) => onChange({ ...value, b2 })}
        />
        <DragNumberInput
          defaultValue={SETHARES_DISSONANCE_PARAMS.s1}
          value={value.s1}
          disabled={!value.showExponentialFit}
          min={0.001}
          max={1}
          valueRange={0.1}
          label="s1"
          onChange={(s1) => onChange({ ...value, s1 })}
        />
        <DragNumberInput
          defaultValue={SETHARES_DISSONANCE_PARAMS.s2}
          value={value.s2}
          disabled={!value.showExponentialFit}
          min={0.1}
          minStep={0.1}
          max={100}
          valueRange={10}
          label="s2"
          onChange={(s2) => onChange({ ...value, s2 })}
        />
        <DragNumberInput
          defaultValue={1}
          value={value.firstOrderContribution}
          min={0}
          max={1}
          minStep={0.01}
          valueRange={1}
          label="1st order"
          onChange={(firstOrderContribution) =>
            onChange({ ...value, firstOrderContribution })
          }
        />
        <DragNumberInput
          defaultValue={0}
          value={value.secondOrderContribution}
          min={0}
          max={1}
          minStep={0.01}
          valueRange={1}
          label="2nd order"
          onChange={(secondOrderContribution) =>
            onChange({ ...value, secondOrderContribution })
          }
        />
        <DragNumberInput
          defaultValue={0}
          value={value.thirdOrderContribution}
          min={0}
          max={1}
          minStep={0.01}
          valueRange={1}
          label="3rd order"
          onChange={(thirdOrderContribution) =>
            onChange({ ...value, thirdOrderContribution })
          }
        />
        <DragNumberInput
          defaultValue={0}
          value={value.phantomHarmonicsNumber}
          min={0}
          minStep={1}
          max={20}
          valueRange={10}
          label="Phantom harmonics"
          onChange={(phantomHarmonicsNumber) =>
            onChange({ ...value, phantomHarmonicsNumber })
          }
        />
      </div>
    </div>
  )
}
