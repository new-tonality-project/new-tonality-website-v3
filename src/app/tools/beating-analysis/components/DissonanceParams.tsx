'use client'

import { DissonanceCurveControls } from '@/components/DissonanceCurveControls'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function DissonanceParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <DissonanceCurveControls
      value={settings}
      onChange={(params) => update(params)}
    />
  )
}
