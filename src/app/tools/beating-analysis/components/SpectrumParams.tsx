'use client'

import { SpectrumParamsEditor } from '@/components/SpectrumParamsEditor'
import {
  createStretchedHarmonics,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function SpectrumParams() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <SpectrumParamsEditor
      fundamentalHz={settings.referenceFrequency}
      harmonics={settings.harmonics}
      harmonicsCount={settings.realHarmonicsNumber}
      stretchFactor={settings.stretchFactor}
      onFundamentalHzChange={(referenceFrequency) =>
        update({ referenceFrequency })
      }
      onHarmonicsChange={(harmonics: SpectrumHarmonic[]) =>
        update({ harmonics })
      }
      onHarmonicsCountChange={(realHarmonicsNumber) =>
        update({
          realHarmonicsNumber,
          harmonics: createStretchedHarmonics(
            realHarmonicsNumber,
            settings.stretchFactor,
          ),
        })
      }
      onStretchFactorChange={(stretchFactor) =>
        update({
          stretchFactor,
          harmonics: createStretchedHarmonics(
            settings.realHarmonicsNumber,
            stretchFactor,
          ),
        })
      }
    />
  )
}
