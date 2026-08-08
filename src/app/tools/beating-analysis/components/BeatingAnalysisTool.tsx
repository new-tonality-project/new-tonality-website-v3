'use client'

import { Container, Prose, CollapsibleDescription } from '@/components'
import { BeatingAnalysisProvider } from './BeatingAnalysisProvider'
import { BeatingCharts } from './BeatingCharts'
import { BeatingControls } from './BeatingControls'

export function BeatingAnalysisTool() {
  return (
    <BeatingAnalysisProvider>
      <aside className="fixed inset-y-0 left-0 z-20 w-72 overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="px-6 py-8">
          <BeatingControls />
        </div>
      </aside>

      <div className="pl-72">
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

            <BeatingCharts />
          </Container>
        </Container>
      </div>
    </BeatingAnalysisProvider>
  )
}
