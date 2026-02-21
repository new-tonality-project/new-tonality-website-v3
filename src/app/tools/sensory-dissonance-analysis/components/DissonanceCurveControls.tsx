'use client'

import { SETHARES_DISSONANCE_PARAMS } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'

export type DissonanceCurveParams = {
  x_star: number
}

const DEFAULT_PARAMS: DissonanceCurveParams = {
  x_star: SETHARES_DISSONANCE_PARAMS.x_star,
}

type DissonanceCurveControlsProps = {
  value: DissonanceCurveParams
  onChange: (params: DissonanceCurveParams) => void
}

export function DissonanceCurveControls({
  value,
  onChange,
}: DissonanceCurveControlsProps) {
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-2 lg:max-w-none">
      <DragNumberInput
        defaultValue={DEFAULT_PARAMS.x_star}
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

export { DEFAULT_PARAMS }
