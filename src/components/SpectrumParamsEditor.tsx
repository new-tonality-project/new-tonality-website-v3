'use client'

import { DragNumberInput } from '@/components'
import { CloseIcon, PlusIcon } from '@/components/Icons'
import { SidebarSection } from '@/components/SidebarSection'
import {
  getNextHarmonic,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import {
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REFERENCE_FREQUENCY,
} from '@/app/tools/beating-analysis/utils'

export type SpectrumParamsEditorProps = {
  fundamentalHz: number
  amplitude: number
  phaseDegrees: number
  harmonics: SpectrumHarmonic[]
  onFundamentalHzChange: (value: number) => void
  onAmplitudeChange: (value: number) => void
  onPhaseDegreesChange: (value: number) => void
  onHarmonicsChange: (harmonics: SpectrumHarmonic[]) => void
}

function HarmonicRow({
  harmonic,
  index,
  onRatioChange,
  onAmplitudeChange,
  onRemove,
}: {
  harmonic: SpectrumHarmonic
  index: number
  onRatioChange: (value: number) => void
  onAmplitudeChange: (value: number) => void
  onRemove: () => void
}) {
  const isFundamental = index === 0

  return (
    <div className="flex items-center gap-1.5">
      <DragNumberInput
        defaultValue={harmonic.ratio}
        value={harmonic.ratio}
        min={1}
        max={64}
        minStep={0.01}
        valueRange={1}
        label="r"
        disabled={isFundamental}
        nonResettable={isFundamental}
        className="min-w-0 shrink"
        onChange={onRatioChange}
      />
      <DragNumberInput
        defaultValue={harmonic.amplitude}
        value={harmonic.amplitude}
        min={0}
        max={2}
        minStep={0.01}
        valueRange={1}
        label="a"
        disabled={isFundamental}
        nonResettable={isFundamental}
        className="min-w-0 shrink"
        onChange={onAmplitudeChange}
      />
      {!isFundamental && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove harmonic"
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-700 dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <CloseIcon className="size-3.5" stroke="currentColor" />
        </button>
      )}
    </div>
  )
}

export function SpectrumParamsEditor({
  fundamentalHz,
  amplitude,
  phaseDegrees,
  harmonics,
  onFundamentalHzChange,
  onAmplitudeChange,
  onPhaseDegreesChange,
  onHarmonicsChange,
}: SpectrumParamsEditorProps) {
  const updateHarmonic = (
    index: number,
    patch: Partial<SpectrumHarmonic>,
  ) => {
    onHarmonicsChange(
      harmonics.map((harmonic, harmonicIndex) =>
        harmonicIndex === index ? { ...harmonic, ...patch } : harmonic,
      ),
    )
  }

  const removeHarmonic = (index: number) => {
    if (index === 0) {
      return
    }

    onHarmonicsChange(harmonics.filter((_, harmonicIndex) => harmonicIndex !== index))
  }

  const addHarmonic = () => {
    onHarmonicsChange([...harmonics, getNextHarmonic(harmonics)])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
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
        <DragNumberInput
          defaultValue={1}
          value={amplitude}
          min={0}
          max={2}
          minStep={0.01}
          valueRange={1}
          label="Amplitude"
          onChange={onAmplitudeChange}
        />
        <DragNumberInput
          defaultValue={DEFAULT_PHASE_DEGREES}
          value={phaseDegrees}
          min={-360}
          max={360}
          minStep={1}
          valueRange={360}
          whole
          label="Phase (°)"
          onChange={onPhaseDegreesChange}
        />
      </div>

      <SidebarSection title="Harmonics">
        {harmonics.map((harmonic, index) => (
          <HarmonicRow
            key={index}
            harmonic={harmonic}
            index={index}
            onRatioChange={(ratio) => updateHarmonic(index, { ratio })}
            onAmplitudeChange={(nextAmplitude) =>
              updateHarmonic(index, { amplitude: nextAmplitude })
            }
            onRemove={() => removeHarmonic(index)}
          />
        ))}
        <button
          type="button"
          onClick={addHarmonic}
          aria-label="Add harmonic"
          className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <PlusIcon className="size-3.5" stroke="currentColor" />
          Add harmonic
        </button>
      </SidebarSection>
    </div>
  )
}
