'use client'

import { Button } from '@/components'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogDescription,
} from '@/components/catalyst/dialog'
import { useState } from 'react'
import { useSurveyMachine } from './useSurveyMachine'
import { SurveyQuestions } from './SurveyQuestions'
import { ExitSurveyAlert } from './ExitSurvey'
import { SurveyOverview } from './SurveyOverview'
import { SurveyExperiment } from './SurveyExperiment'

export function Survey(props: {
  open: boolean
  setSurveyOpen: (v: boolean) => void
}) {
  const [state, send] = useSurveyMachine()
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <Dialog
      className="z-50"
      open={props.open}
      onClose={() => setAlertOpen(true)}
      size="5xl"
    >
      <DialogTitle>{state.context.title}</DialogTitle>
      <DialogDescription>{state.context.description}</DialogDescription>

      <DialogBody>
        {state.matches('overview') && <SurveyOverview />}
        {state.matches('questions') && <SurveyQuestions />}
        {state.matches('experiment') && <SurveyExperiment />}

        <ExitSurveyAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          exitSurvey={() => props.setSurveyOpen(false)}
        />
      </DialogBody>

      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => {
            send({ type: 'exitSurvey' })
            setAlertOpen(true)
          }}
        >
          Exit survey
        </Button>

        {state.matches('overview') && (
          <Button
            onClick={() => {
              send({ type: 'toQuestions' })
            }}
          >
            Continue
          </Button>
        )}

        {state.matches('questions') && (
          <Button
            variant="primary"
            disabled={
              !state.context.musicalBackground ||
              (!state.context.shareAnonymously && !state.context.sharePublicly)
            }
            onClick={() => {
              send({
                type: 'toExperiment',
              })
            }}
          >
            Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
