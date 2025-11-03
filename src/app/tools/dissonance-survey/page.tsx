'use client'

import { Button, SimpleLayout } from '@/components'
import { SignInButton, useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { Survey, SurveyChart } from './components'
import { SurveyMachineProvider } from '@/state/machines'
import { db } from '@/db'
import { Text, TextLink } from '@/components/catalyst/text'

export default function DissonanceSurveyPage() {
  const { userId } = useAuth()
  const [surveyOpen, setSurveyOpen] = useState(false)

  return (
    <SimpleLayout
      title="Dissonance survey"
      intro={
        <Text>
          This survey is a modified recreation of a series of experiments that
          were conducted in 1960s by R. Plomp and W. J. M. Levelt. Their paper
          titled as{' '}
          <TextLink
            href="https://www.mpi.nl/world/materials/publications/levelt/Plomp_Levelt_Tonal_1965.pdf"
            target="_blank"
          >
            "Tonal Consonance And Critical Bandwidth"
          </TextLink>{' '}
          is one of the central pieces of research behind modern empirical
          understanding of dissonance. The results of their experiments lie in
          the basis of the William Sethares's idea of dissonance cureves. The
          purpose of that survey is to replicate the experiments and investigate
          if the second order beating should be included in the dissonance curve
          calculation and to popularise that topic among
          musicians.
        </Text>
      }
    >
      <db.SignedIn>
        <SurveyChart />
      </db.SignedIn>

      <div className="my-12" />

      {!userId && (
        <div className="justity-between flex items-center gap-12 rounded-lg border border-zinc-300 px-12 py-6">
          <p>You have to log in to take part in survey</p>

          <SignInButton>
            <Button variant="primary" className="ml-auto max-w-fit">
              Sign In
            </Button>
          </SignInButton>
        </div>
      )}

      {userId && (
        <div className="justity-between flex items-center gap-12 rounded-lg border border-zinc-300 px-12 py-6">
          <p>
            Find out your own personal dissonance preference <br /> by taking
            part in the survey
          </p>

          <Button
            onClick={() => setSurveyOpen(true)}
            variant="primary"
            className="ml-auto max-w-fit"
          >
            Start survey
          </Button>
        </div>
      )}

      <SurveyMachineProvider>
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
    </SimpleLayout>
  )
}
