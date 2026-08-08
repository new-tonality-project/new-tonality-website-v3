'use client'

import { SpectrumParamsEditor } from '@/components/SpectrumParamsEditor'
import { getMaxHarmonicRatio } from '@/lib/spectrum'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function SpectrumParamsPanel() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <SpectrumParamsEditor
      fundamentalHz={settings.referenceFrequency}
      amplitude={settings.amplitude}
      phaseDegrees={settings.phaseDegrees}
      harmonics={settings.harmonics}
      onFundamentalHzChange={(referenceFrequency) =>
        update({ referenceFrequency })
      }
      onAmplitudeChange={(amplitude) => update({ amplitude })}
      onPhaseDegreesChange={(phaseDegrees) => update({ phaseDegrees })}
      onHarmonicsChange={(harmonics) =>
        update({
          harmonics,
          realHarmonicsNumber: getMaxHarmonicRatio(harmonics),
        })
      }
    />
  )
}
