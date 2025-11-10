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
import { useSurveyMachine } from '@/state/machines'
import { SurveyQuestions } from './SurveyQuestions'
import { ExitSurveyAlert } from './ExitSurvey'
import { SurveyOverview } from './SurveyOverview'
import { SurveyExperiment } from './SurveyExperiment'
import { SurveyListening } from './SurveyListening'
import { useRouter } from 'next/navigation'

export function Survey(props: {
  open: boolean
  setSurveyOpen: (v: boolean) => void
}) {
  const [state, send] = useSurveyMachine()
  const [alertOpen, setAlertOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog
      className="z-50"
      open={props.open}
      onClose={() => setAlertOpen(true)}
      size="3xl"
    >
      <DialogTitle>{state.context.title}</DialogTitle>
      <DialogDescription className="whitespace-pre-line">
        {state.context.description}
      </DialogDescription>

      <DialogBody>
        {state.matches('overview') && <SurveyOverview />}
        {state.matches('questions') && <SurveyQuestions />}
        {state.matches('listening') && <SurveyListening />}
        {state.matches('experiment') && <SurveyExperiment />}
        {state.matches('success') && <div>All good!</div>}
        {state.matches('error') && <div>Something went wrong!</div>}

        <ExitSurveyAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          exitSurvey={() => {
            props.setSurveyOpen(false)

            setTimeout(() => {
              send({ type: 'exitSurvey' })
              router.refresh()
            }, 250)
          }}
        />
      </DialogBody>

      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => {
            if (state.matches('success') || state.matches('error')) {
              props.setSurveyOpen(false)

              setTimeout(() => {
                send({ type: 'exitSurvey' })
              }, 250)
            } else {
              setAlertOpen(true)
            }
          }}
        >
          {state.matches('success') ? 'Look results' : 'Exit survey'}
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
              state.context.musicalBackground === undefined ||
              (!state.context.shareDataPrivately &&
                !state.context.shareDataPublicly)
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
