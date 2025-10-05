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
import { SurveyListening } from './SurveyListening'

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
      <DialogDescription className="whitespace-pre-line">{state.context.description}</DialogDescription>

      <DialogBody>
        {state.matches('overview') && <SurveyOverview />}
        {state.matches('questions') && <SurveyQuestions />}
        {state.matches('listening') && <SurveyListening />}
        {state.matches('experiment') && <SurveyExperiment />}

        <ExitSurveyAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          exitSurvey={() => {
            props.setSurveyOpen(false)

            setTimeout(() => {
              send({ type: 'exitSurvey' })
            }, 250)
          }}
        />
      </DialogBody>

      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => {
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
                type: 'toListening',
              })
            }}
          >
            Continue
          </Button>
        )}

        {state.matches('listening') && (
          <Button
            disabled={!state.context.canStartExperiment}
            onClick={() => {
              send({ type: 'toExperiment' })
            }}
          >
            Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
