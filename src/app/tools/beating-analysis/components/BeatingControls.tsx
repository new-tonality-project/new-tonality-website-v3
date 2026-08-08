'use client'

import { DEFAULT_PHANTOM_HARMONICS_NUMBER } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import {
  DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  DEFAULT_PERIODS,
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REAL_HARMONICS_NUMBER,
  DEFAULT_REFERENCE_FREQUENCY,
} from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
      {children}
    </h3>
  )
}

export function BeatingControls() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <SectionHeading>Spectrum</SectionHeading>
        <DragNumberInput
          defaultValue={DEFAULT_REFERENCE_FREQUENCY}
          value={settings.referenceFrequency}
          min={20}
          max={2000}
          minStep={1}
          valueRange={200}
          whole
          label="Reference (Hz)"
          onChange={(referenceFrequency) => update({ referenceFrequency })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_REAL_HARMONICS_NUMBER}
          value={settings.realHarmonicsNumber}
          min={1}
          max={20}
          minStep={1}
          valueRange={10}
          whole
          label="Real harmonics"
          onChange={(realHarmonicsNumber) => update({ realHarmonicsNumber })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_PHANTOM_HARMONICS_NUMBER}
          value={settings.phantomHarmonicsNumber}
          min={0}
          max={20}
          minStep={1}
          valueRange={10}
          whole
          label="Phantom harmonics"
          onChange={(phantomHarmonicsNumber) =>
            update({ phantomHarmonicsNumber })
          }
        />
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
        <DragNumberInput
          defaultValue={1}
          value={settings.amplitude}
          min={0}
          max={2}
          minStep={0.01}
          valueRange={1}
          label="Amplitude"
          onChange={(amplitude) => update({ amplitude })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_DISSONANCE_CURVE_MIN_CENTS}
          value={settings.dissonanceCurveMinCents}
          min={0}
          max={4800}
          minStep={1}
          valueRange={100}
          whole
          label="Min cents"
          onChange={(dissonanceCurveMinCents) =>
            update({ dissonanceCurveMinCents })
          }
        />
        <DragNumberInput
          defaultValue={DEFAULT_DISSONANCE_CURVE_MAX_CENTS}
          value={settings.dissonanceCurveMaxCents}
          min={0}
          max={4800}
          minStep={1}
          valueRange={100}
          whole
          label="Max cents"
          onChange={(dissonanceCurveMaxCents) =>
            update({ dissonanceCurveMaxCents })
          }
        />
      </section>

      <section className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <SectionHeading>Waveforms</SectionHeading>
        <DragNumberInput
          defaultValue={DEFAULT_PHASE_DEGREES}
          value={settings.phaseDegrees}
          min={-360}
          max={360}
          minStep={1}
          valueRange={360}
          whole
          label="Phase (°)"
          onChange={(phaseDegrees) => update({ phaseDegrees })}
        />
        <DragNumberInput
          defaultValue={DEFAULT_PERIODS}
          value={settings.periods}
          min={1}
          max={1000}
          minStep={1}
          valueRange={100}
          whole
          label="Wave periods"
          onChange={(periods) => update({ periods })}
        />

        <div className="flex flex-col gap-3">
          <CheckboxField>
            <Checkbox
              checked={settings.showEnvelope}
              onChange={(showEnvelope) => update({ showEnvelope })}
            />
            <Label className="text-sm">Show envelope</Label>
          </CheckboxField>
          <CheckboxField>
            <Checkbox
              checked={settings.showRms}
              onChange={(showRms) => update({ showRms })}
            />
            <Label className="text-sm">Show RMS</Label>
          </CheckboxField>
        </div>
      </section>
    </div>
  )
}
