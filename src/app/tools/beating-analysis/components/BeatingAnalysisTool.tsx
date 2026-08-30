'use client'

import { useState } from 'react'
import { Container, Prose, CollapsibleDescription } from '@/components'
import { BeatingAnalysisProvider } from './BeatingAnalysisProvider'
import {
  DissonanceParamsSidebar,
  SpectrumParamsSidebar,
} from './BeatingAnalysisSidebar'
import { BeatingCharts } from './BeatingCharts'
import { useBeatingAnalysisAudio } from './useBeatingAnalysisAudio'

function BeatingAnalysisToolContent() {
  const [dissonanceOpen, setDissonanceOpen] = useState(false)
  const [spectrumOpen, setSpectrumOpen] = useState(false)

  useBeatingAnalysisAudio()

  return (
    <>
      <DissonanceParamsSidebar
        open={dissonanceOpen}
        onClose={() => setDissonanceOpen(false)}
      />
      <SpectrumParamsSidebar
        open={spectrumOpen}
        onClose={() => setSpectrumOpen(false)}
      />

      <Container className="mt-16 lg:mt-32">
        <Container>
          <header>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              Beating analysis
            </h1>
          </header>
          <Prose>
            <CollapsibleDescription>
              <p>
                When two pure tones are played together at slightly different
                frequencies, their waveforms interfere and produce a periodic
                variation in loudness called beating. The beat rate equals the
                frequency difference between the two tones.
              </p>
              <p>
                This tool visualizes beating with a reference tone and a second
                tone whose frequency is controlled by the interval in cents.
                Adjust reference frequency, number of periods, interval,
                amplitude, and phase to see how the combined waveform changes.
              </p>
            </CollapsibleDescription>

            <div className="h-4 md:h-2" />
          </Prose>

          <BeatingCharts
            dissonanceOpen={dissonanceOpen}
            onToggleDissonance={() => setDissonanceOpen((open) => !open)}
            spectrumOpen={spectrumOpen}
            onToggleSpectrum={() => setSpectrumOpen((open) => !open)}
          />
        </Container>
      </Container>
    </>
  )
}

export function BeatingAnalysisTool() {
  return (
    <BeatingAnalysisProvider>
      <BeatingAnalysisToolContent />
    </BeatingAnalysisProvider>
  )
}
