'use client'

import { SpectrumParamsEditor } from '@/components/SpectrumParamsEditor'
import { getMaxHarmonicRatio, type SpectrumHarmonic } from '@/lib/spectrum'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function SpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  const handleHarmonicsChange = (harmonics: SpectrumHarmonic[]) => {
    update({
      harmonics,
      realHarmonicsNumber: getMaxHarmonicRatio(harmonics),
    })
  }

  return (
    <SpectrumParamsEditor
      fundamentalHz={settings.referenceFrequency}
      harmonics={settings.harmonics}
      onFundamentalHzChange={(referenceFrequency) =>
        update({ referenceFrequency })
      }
      onHarmonicsChange={handleHarmonicsChange}
    />
  )
}
