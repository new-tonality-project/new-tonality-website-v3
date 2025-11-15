'use client'

import { Button } from '@/components'
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@/components/catalyst/alert'

export function ExitSurveyAlert(props: {
  open: boolean
  setOpen: (v: boolean) => void
  exitSurvey: () => void
}) {
  return (
    <Alert open={props.open} onClose={props.setOpen}>
      <AlertTitle>Are you sure you want to exit the experiment?</AlertTitle>
      <AlertDescription>
        You will loose all your progress if you exit now. You can start from the
        beginning later.
      </AlertDescription>
      <AlertActions>
        <Button variant="secondary" onClick={() => props.setOpen(false)}>
          Back to experiment
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.setOpen(false)
            props.exitSurvey()
          }}
        >
          Exit experiment
        </Button>
      </AlertActions>
    </Alert>
  )
}
