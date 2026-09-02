'use client'

import { DissonanceCurveControls } from '@/components/DissonanceCurveControls'
import { useDissonanceParams } from '@/components/DissonanceParamsProvider'

export function DissonanceParams() {
  const { settings, update } = useDissonanceParams()

  return (
    <DissonanceCurveControls
      value={settings}
      onChange={(params) => update(params)}
    />
  )
}
