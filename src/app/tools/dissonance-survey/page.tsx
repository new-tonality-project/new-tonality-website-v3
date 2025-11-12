'use client'

import { Container, Prose } from '@/components'
import { SurveyChart, SurveyChartPublic } from './components'
import { db } from '@/db'
import Link from 'next/link'
import { Divider } from '@/components/catalyst/divider'
import { TextLink } from '@/components/catalyst/text'

export default function DissonanceSurveyPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <Container>
        <header>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Dissonance survey
          </h1>
        </header>
        <Prose>
          <p>
            This survey is based on the classic work by{' '}
            <TextLink
              href="https://www.mpi.nl/world/materials/publications/levelt/Plomp_Levelt_Tonal_1965.pdf"
              target="_blank"
            >
              Plomp & Levelt
            </TextLink>
            , that introduced the concept of sensory dissonance and made
            important contribution to modern psychoacoustic research. It has
            found its practical application in the work of William Sethares
            outlined in the book{' '}
            <TextLink
              href="https://www.r-5.org/files/books/rx-music/tuning/William_A_Sethares-Tuning_Timbre_Spectrum_Scale-EN.pdf"
              target="_blank"
            >
              Tuning, Timbre, Spectrum, Scale
            </TextLink>
            . The dependency of sensory dissonance vs musical interval that
            Plomp and Levelt discovered, was used by Sethares for calculation of
            dissonance curves that relate tuning and timbre of instruments.
          </p>

          <p>
            Below you can see a set of graphs that show the dependency of
            sensory dissonance vs musical interval for different registers. The
            graphs are simmilar to the ones found in the original work and are
            obtained by similar procedure. Sign in and take part in the survey
            to see your own results and compare them to others, you dont need to
            be a musician to take part in the survey.
          </p>

          <h2 className="mt-10">High register</h2>
          <Divider className="my-4" />
          <db.SignedOut>
            <SurveyChartPublic meanFrequency={1320} />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={1320} />
          </db.SignedIn>

          <h2 className="mt-10">Middle register</h2>
          <Divider className="my-4" />
          <db.SignedOut>
            <SurveyChartPublic meanFrequency={440} />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={440} />
          </db.SignedIn>

          <h2 className="mt-10">Low register</h2>
          <Divider className="my-4" />
          <db.SignedOut>
            <SurveyChartPublic meanFrequency={147} />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={147} />
          </db.SignedIn>
        </Prose>
      </Container>
    </Container>
  )
}
