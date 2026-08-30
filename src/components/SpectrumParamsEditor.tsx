'use client'

import { DragNumberInput } from '@/components'
import { SidebarSection } from '@/components/SidebarSection'
import {
  DEFAULT_STRETCH_FACTOR,
  getDefaultHarmonic,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import { DEFAULT_REFERENCE_FREQUENCY } from '@/app/tools/beating-analysis/utils'

export type SpectrumParamsEditorProps = {
  fundamentalHz?: number
  harmonics: SpectrumHarmonic[]
  harmonicsCount: number
  stretchFactor: number
  onFundamentalHzChange?: (value: number) => void
  onHarmonicsChange?: (harmonics: SpectrumHarmonic[]) => void
  onHarmonicsCountChange?: (count: number) => void
  onStretchFactorChange?: (stretchFactor: number) => void
}

export function SpectrumParamsEditor({
  fundamentalHz,
  harmonics,
  harmonicsCount,
  stretchFactor,
  onFundamentalHzChange,
  onHarmonicsChange,
  onHarmonicsCountChange,
  onStretchFactorChange,
}: SpectrumParamsEditorProps) {
  const updateHarmonic = (
    index: number,
    patch: Partial<SpectrumHarmonic>,
  ) => {
    if (!onHarmonicsChange) {
      return
    }

    onHarmonicsChange(
      harmonics.map((harmonic, harmonicIndex) =>
        harmonicIndex === index ? { ...harmonic, ...patch } : harmonic,
      ),
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {fundamentalHz !== undefined && onFundamentalHzChange && (
        <DragNumberInput
          defaultValue={DEFAULT_REFERENCE_FREQUENCY}
          value={fundamentalHz}
          min={20}
          max={2000}
          minStep={1}
          valueRange={200}
          whole
          label="Fundamental (Hz)"
          onChange={onFundamentalHzChange}
        />
      )}

      <DragNumberInput
        defaultValue={1}
        value={harmonicsCount}
        min={1}
        max={32}
        minStep={1}
        valueRange={10}
        whole
        label="Count"
        onChange={onHarmonicsCountChange}
      />
      <DragNumberInput
        defaultValue={DEFAULT_STRETCH_FACTOR}
        value={stretchFactor}
        min={1.01}
        max={8}
        minStep={0.01}
        valueRange={1}
        label="Stretch"
        onChange={onStretchFactorChange}
      />

      <SidebarSection title="Harmonics">
        {harmonics.map((harmonic, index) => {
          const isFundamental = index === 0
          const defaultHarmonic = getDefaultHarmonic(index, stretchFactor)

          return (
            <div key={index} className="flex items-center gap-4">
              <DragNumberInput
                variant="mini"
                className="ml-0"
                defaultValue={defaultHarmonic.ratio}
                value={harmonic.ratio}
                min={1}
                max={1024}
                minStep={0.01}
                valueRange={1}
                label="r"
                disabled={isFundamental}
                nonResettable={isFundamental}
                onChange={(ratio) => updateHarmonic(index, { ratio })}
              />
              <DragNumberInput
                variant="mini"
                className="ml-0"
                defaultValue={defaultHarmonic.amplitude}
                value={harmonic.amplitude}
                min={0}
                max={1}
                minStep={0.01}
                valueRange={1}
                label="amp"
                onChange={(nextAmplitude) =>
                  updateHarmonic(index, { amplitude: nextAmplitude })
                }
              />
            </div>
          )
        })}
      </SidebarSection>
    </div>
  )
}
