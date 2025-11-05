'use client'

import { Container, Prose } from '@/components'
import { SurveyChart, SurveyChartPublic } from './components'
import { db } from '@/db'
import Link from 'next/link'
import { Divider } from '@/components/catalyst/divider'

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
            This survey is a modified recreation of a series of experiments that
            were conducted in 1960s by R. Plomp and W. J. M. Levelt. Their paper
            titled as{' '}
            <Link
              href="https://www.mpi.nl/world/materials/publications/levelt/Plomp_Levelt_Tonal_1965.pdf"
              target="_blank"
            >
              "Tonal Consonance And Critical Bandwidth"
            </Link>{' '}
            is one of the central pieces of research behind modern empirical
            understanding of dissonance. The results of their experiments lie in
            the basis of the William Sethares's idea of dissonance cureves. The
            purpose of that survey is to replicate the experiments and
            investigate if the second order beating should be included in the
            dissonance curve calculation and to popularise that topic among
            musicians.
          </p>

          <h2 className="mt-10">High register</h2>
          <Divider className="my-4" />
          <db.SignedOut>
            <SurveyChartPublic meanFrequency={880} />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={880} />
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
            <SurveyChartPublic meanFrequency={220} />
          </db.SignedOut>
          <db.SignedIn>
            <SurveyChart meanFrequency={220} />
          </db.SignedIn>

          <p>
            And we can finish off with some discussion on how to read the
            results
          </p>
        </Prose>
      </Container>
    </Container>
  )
}
