'use client'

import { Button, SimpleLayout } from '@/components'
import { SignInButton, useAuth } from '@clerk/nextjs'
import { useState } from 'react'
import { Survey } from './Survey'
import { SurveyChart } from './SurveyChart'
import { SurveyMachineProvider } from './useSurveyMachine'
import { db } from '@/db'

const pageIntro =
  'REWRITE: This tool is a part of the psychoacoustic experiment that was first outlined in 1960s paper by Plomp and Levelt and that is the basis behind modern empirical understanding of dissonance.'

export default function DissonanceSurveyPage() {
  const { userId } = useAuth()
  const [surveyOpen, setSurveyOpen] = useState(false)

  return (
    <SimpleLayout title="Dissonance survey" intro={pageIntro}>
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
