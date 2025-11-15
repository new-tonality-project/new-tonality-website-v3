'use client'

import { Container, Prose, CollapsibleDescription } from '@/components'
import { SurveyChart, SurveyChartPublic } from './components'
import { db } from '@/db'
import { TextLink } from '@/components/catalyst/text'

export default function DissonanceSurveyPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <Container>
        <header>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Sensory dissonance analysis
          </h1>
        </header>
        <Prose>
          <CollapsibleDescription>
            <p>
              This experiment is based on the classic work by{' '}
              <TextLink
                href="https://www.mpi.nl/world/materials/publications/levelt/Plomp_Levelt_Tonal_1965.pdf"
                target="_blank"
              >
                Plomp & Levelt
              </TextLink>
              , that made an important contribution to the modern psychoacoustic
              research by introducing the concept of sensory dissonance of pure
              sinewaves and its dependency on musical intervals. That discovery
              found its practical application in the work of William Sethares{' '}
              <TextLink
                href="https://www.r-5.org/files/books/rx-music/tuning/William_A_Sethares-Tuning_Timbre_Spectrum_Scale-EN.pdf"
                target="_blank"
              >
                Tuning, Timbre, Spectrum, Scale
              </TextLink>
              . He used it to calculate dissonance curves which can be used to
              extract tuning from the timbre of musical instruments. He showed
              how dissonance curves predict most common musical chords, how they
              can be used to build dynamic tuning systems or to tune inharmonic
              instruments.
            </p>

            <p>
              Below you can see a set of graphs that show that dependency of
              sensory dissonance vs musical interval for different registers.
              Each line on the graph is the result of a real person listening to
              intervals and rating how dissonant those intervals sound to them.
              You can take part in that experiment too! Sign in and find out
              your own dissonance preference and compare it with others. It
              takes only 5 minutes to complete and you dont need to be a
              musician to take part in it.
            </p>
          </CollapsibleDescription>

          <div className="h-4 md:h-2" />

          <db.SignedOut>
            <SurveyChartPublic meanFrequency={1320} title="High frequencies" />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={1320} title="High frequencies" />
          </db.SignedIn>

          <db.SignedOut>
            <SurveyChartPublic meanFrequency={440} title="Middle frequencies" />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={440} title="Middle frequencies" />
          </db.SignedIn>

          <db.SignedOut>
            <SurveyChartPublic meanFrequency={147} title="Low frequencies" />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={147} title="Low frequencies" />
          </db.SignedIn>

          <h2>Some more background</h2>

          <p>
            The results of Plomp and Levelt were not recieved without cotroversy
            because they deviated from the scientific and musical consensus at
            that time. That was not due to the mistake but because Plomp and
            Levelt intentionally modified their experiments in a way that was
            not done before. Firt of all, the participants were not trained
            musicians but rather people from the general public. Second, they
            used a series of intervals that were not based on 12TET nor on
            simple ratios. This was important to exclude previous training or
            previous cultural experience from the results and get the raw
            sensory data. Another important aspect was that they used pure
            sinewaves to conduct listening experiments, that was done to exclude
            the role that timbre might play in the perception of dissonance.
          </p>

          <p>
            In this experiment we attempt to replicate the approach of Plomp and
            Levelt. They results will not bear the same scientific rigor as the
            experiments are not conducted in controlled laboratory environment,
            but it is still interesting to see how it will compare to the
            original work. Also in the end you will be able to see your own
            results that you could use to build your own dissonance curvesand
            share them with others.
          </p>
        </Prose>
      </Container>
    </Container>
  )
}
