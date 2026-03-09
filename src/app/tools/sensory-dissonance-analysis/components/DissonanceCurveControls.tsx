'use client'

import { DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS } from 'sethares-dissonance'
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
          defaultValue={0}
          value={value.xAxisStart}
          min={-3600}
          max={Math.max(0, value.xAxisEnd - 1)}
          minStep={1}
          valueRange={1000}
          whole
          label="Start (cents)"
          onChange={(xAxisStart) => onChange({ ...value, xAxisStart })}
        />
        <DragNumberInput
          defaultValue={1200}
          value={value.xAxisEnd}
          min={Math.min(1200, value.xAxisStart + 1)}
          max={3600}
          minStep={1}
          valueRange={1000}
          whole
          label="End (cents)"
          onChange={(xAxisEnd) => onChange({ ...value, xAxisEnd })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.x_star}
          value={value.firstOrderDissonance.x_star ?? DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.x_star}
          disabled={!value.showExponentialFit}
          min={0.001}
          max={1}
          valueRange={0.1}
          label="x*"
          onChange={(x_star) =>
            onChange({
              ...value,
              firstOrderDissonance: {
                ...value.firstOrderDissonance,
                x_star,
              },
            })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b1}
          value={value.firstOrderDissonance.b1 ?? DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b1}
          disabled={!value.showExponentialFit}
          min={0.01}
          minStep={0.01}
          max={10}
          valueRange={1}
          label="b1"
          onChange={(b1) =>
            onChange({
              ...value,
              firstOrderDissonance: {
                ...value.firstOrderDissonance,
                b1,
              },
            })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b2}
          value={value.firstOrderDissonance.b2 ?? DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b2}
          disabled={!value.showExponentialFit}
          min={0.01}
          minStep={0.01}
          max={10}
          valueRange={1}
          label="b2"
          onChange={(b2) =>
            onChange({
              ...value,
              firstOrderDissonance: {
                ...value.firstOrderDissonance,
                b2,
              },
            })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s1}
          value={value.firstOrderDissonance.s1 ?? DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s1}
          disabled={!value.showExponentialFit}
          min={0.001}
          max={1}
          valueRange={0.1}
          label="s1"
          onChange={(s1) =>
            onChange({
              ...value,
              firstOrderDissonance: {
                ...value.firstOrderDissonance,
                s1,
              },
            })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s2}
          value={value.firstOrderDissonance.s2 ?? DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s2}
          disabled={!value.showExponentialFit}
          min={0.1}
          minStep={0.1}
          max={100}
          valueRange={10}
          label="s2"
          onChange={(s2) =>
            onChange({
              ...value,
              firstOrderDissonance: {
                ...value.firstOrderDissonance,
                s2,
              },
            })
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
