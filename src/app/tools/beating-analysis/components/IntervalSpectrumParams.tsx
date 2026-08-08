'use client'

import { DragNumberInput } from '@/components'
import { SpectrumParamsEditor } from '@/components/SpectrumParamsEditor'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import {
  cloneHarmonics,
  getMaxHarmonicRatioAcross,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function IntervalSpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  const handleSpectraLinkedChange = (spectraLinked: boolean) => {
    if (spectraLinked) {
      const intervalHarmonics = cloneHarmonics(settings.referenceHarmonics)
      update({
        spectraLinked: true,
        intervalHarmonics,
        realHarmonicsNumber: getMaxHarmonicRatioAcross(
          settings.referenceHarmonics,
        ),
      })
      return
    }

    update({ spectraLinked: false })
  }

  const handleHarmonicsChange = (intervalHarmonics: SpectrumHarmonic[]) => {
    if (settings.spectraLinked) {
      return
    }

    update({
      intervalHarmonics,
      realHarmonicsNumber: getMaxHarmonicRatioAcross(
        settings.referenceHarmonics,
        intervalHarmonics,
      ),
    })
  }

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

      <CheckboxField>
        <Checkbox
          checked={settings.spectraLinked}
          onChange={handleSpectraLinkedChange}
        />
        <Label className="text-sm">Link harmonics to reference</Label>
      </CheckboxField>

      {settings.spectraLinked && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Partial ratios and amplitudes follow the reference spectrum.
          Unlink to edit them independently.
        </p>
      )}

      <SpectrumParamsEditor
        amplitude={settings.amplitude}
        phaseDegrees={settings.phaseDegrees}
        harmonics={settings.intervalHarmonics}
        harmonicsDisabled={settings.spectraLinked}
        onAmplitudeChange={(amplitude) => update({ amplitude })}
        onPhaseDegreesChange={(phaseDegrees) => update({ phaseDegrees })}
        onHarmonicsChange={handleHarmonicsChange}
      />
    </div>
  )
}
