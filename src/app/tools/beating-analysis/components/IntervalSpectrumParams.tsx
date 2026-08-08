'use client'

import { DragNumberInput } from '@/components'
import { SpectrumParamsPanel } from './SpectrumParamsPanel'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function IntervalSpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-6">
      <DragNumberInput
        defaultValue={10}
        value={settings.intervalCents}
        min={0}
        max={4800}
        minStep={1}
        valueRange={100}
        label="Interval (cents)"
        onChange={(intervalCents) => update({ intervalCents })}
      />
      <SpectrumParamsPanel />
    </div>
  )
}
