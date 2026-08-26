'use client'

import { SpectrumParamsEditor } from '@/components/SpectrumParamsEditor'
import {
  cloneHarmonics,
  getMaxHarmonicRatioAcross,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function ReferenceSpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  const handleHarmonicsChange = (referenceHarmonics: SpectrumHarmonic[]) => {
    if (settings.spectraLinked) {
      update({
        referenceHarmonics,
        intervalHarmonics: cloneHarmonics(referenceHarmonics),
        realHarmonicsNumber: getMaxHarmonicRatioAcross(referenceHarmonics),
      })
      return
    }

    update({
      referenceHarmonics,
      realHarmonicsNumber: getMaxHarmonicRatioAcross(
        referenceHarmonics,
        settings.intervalHarmonics,
      ),
    })
  }

  return (
    <SpectrumParamsEditor
      fundamentalHz={settings.referenceFrequency}
      harmonics={settings.referenceHarmonics}
      onFundamentalHzChange={(referenceFrequency) =>
        update({ referenceFrequency })
      }
      onHarmonicsChange={handleHarmonicsChange}
    />
  )
}
