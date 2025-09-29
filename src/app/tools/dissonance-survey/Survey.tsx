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
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/catalyst/alert'
import {
  CheckboxGroup,
  CheckboxField,
  Checkbox,
} from '@/components/catalyst/checkbox'
import { Description, Fieldset, Label } from '@/components/catalyst/fieldset'
import { useSurveyMachine } from './useSurveyMachine'

function ExitSurveyAlert(props: {
  open: boolean
  setOpen: (v: boolean) => void
  exitSurvey: () => void
}) {
  return (
    <Alert open={props.open} onClose={props.setOpen}>
      <AlertTitle>Are you sure you want to exit the survey?</AlertTitle>
      <AlertDescription>
        You will loose all your progress if you exit now. You can start from the
        beginning later.
      </AlertDescription>
      <AlertActions>
        <Button variant="secondary" onClick={() => props.setOpen(false)}>
          Back to survey
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.setOpen(false)
            props.exitSurvey()
          }}
        >
          Exit survey
        </Button>
      </AlertActions>
    </Alert>
  )
}

function SurveyDisclamer() {
  const [, send] = useSurveyMachine()
  const [shareAnonymously, setShareAnonymously] = useState(false)
  const [shareAnonymouslyDisabled, setShareAnonymouslyDisabled] =
    useState(false)
  const [sharePublicly, setSharePublicly] = useState(false)

  return (
    <Fieldset>
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            name="disclamer"
            value="share_anonymously"
            checked={shareAnonymously}
            onChange={(e) => setShareAnonymously(e.valueOf())}
            disabled={shareAnonymouslyDisabled}
          />
          <Label>Allow to share anonymously</Label>
          <Description>
            By acceptingm, you agree that your results may be shared anonymously
            as part of an entire dataset. You will be able to see your result if
            you log in, but you will not be able to share it with others by
            linking to it.
          </Description>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="disclamer"
            value="share_publicly"
            checked={sharePublicly}
            onChange={(e) => {
              const val = e.valueOf()

              setSharePublicly(val)
              if (val) setShareAnonymously(val)
              setShareAnonymouslyDisabled(val)
            }}
          />
          <Label>Allow to share publicly</Label>
          <Description>
            By accepting you agree that your results may be shared publicly
            under your username. You will be able to share your result with
            others by linking to it.
          </Description>
        </CheckboxField>
      </CheckboxGroup>
      <Button
        className="mt-8"
        variant="primary"
        disabled={!shareAnonymously && !sharePublicly}
        onClick={() => {
          send({
            type: 'acceptDisclamer',
            value: { shareAnonymously, sharePublicly },
          })
        }}
      >
        Accept and continue
      </Button>
    </Fieldset>
  )
}

function SurveyStart() {
  return <div>SurveyStart</div>
}

export function Survey(props: {
  open: boolean
  setSurveyOpen: (v: boolean) => void
}) {
  const [state] = useSurveyMachine()
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <Dialog open={props.open} onClose={() => setAlertOpen(true)} size="5xl">
      <DialogTitle>{state.context.title}</DialogTitle>
      <DialogDescription>{state.context.description}</DialogDescription>

      <DialogBody>
        {state.matches('disclamer') && <SurveyDisclamer />}
        {state.matches('start') && <SurveyStart />}
      </DialogBody>

      <DialogActions>
        <Button variant="secondary" onClick={() => setAlertOpen(true)}>
          Exit survey
        </Button>
        <ExitSurveyAlert
          open={alertOpen}
          setOpen={setAlertOpen}
          exitSurvey={() => props.setSurveyOpen(false)}
        />
      </DialogActions>
    </Dialog>
  )
}
