'use client'

import { useEffect, useMemo, useState } from 'react'
import { db } from '@/db'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogDescription,
} from '@/components/catalyst/dialog'
import { Button } from '@/components'
import { Text } from '@/components/catalyst/text'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'
import { EXPERIMENTS } from '../utils'

export function UnfinishedExperimentsModal() {
  const user = db.useUser()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(
    null,
  )
  const [surveyOpen, setSurveyOpen] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)

  const userGraphs = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
          $users: user?.id,
        },
      },
    },
  })

  const userSettings = db.useQuery({
    userSettings: {
      $: {
        where: {
          $users: user?.id,
        },
      },
    },
  })

  const unfinishedExperiments = useMemo(() => {
    if (!user?.id || userGraphs.isLoading) return []

    const completedFrequencies = new Set(
      userGraphs.data?.dissonanceGraphs.map((g) => g.meanFrequency) ?? [],
    )

    if (completedFrequencies.size === 0) return []

    return EXPERIMENTS.filter(
      (exp) => !completedFrequencies.has(exp.frequency),
    )
  }, [user?.id, userGraphs.data, userGraphs.isLoading])

  useEffect(() => {
    if (
      user?.id &&
      !userGraphs.isLoading &&
      unfinishedExperiments.length > 0 &&
      !modalOpen &&
      !surveyOpen &&
      !hasBeenDismissed
    ) {
      const timer = setTimeout(() => {
        setModalOpen(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [
    user?.id,
    userGraphs.isLoading,
    unfinishedExperiments.length,
    modalOpen,
    surveyOpen,
    hasBeenDismissed,
  ])

  const handleStartExperiment = (frequency: number) => {
    setSelectedFrequency(frequency)
    setModalOpen(false)
    setHasBeenDismissed(true)
    setSurveyOpen(true)
  }

  if (!user?.id || !userSettings.data || unfinishedExperiments.length === 0) {
    return null
  }

  return (
    <>
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setHasBeenDismissed(true)
        }}
        size="lg"
      >
        <DialogTitle>Continue Your Experiments</DialogTitle>
        <DialogDescription>
          You have {unfinishedExperiments.length === 1 ? 'an' : 'some'}{' '}
          unfinished experiment{unfinishedExperiments.length > 1 ? 's' : ''}.
          Would you like to continue?
        </DialogDescription>

        <DialogBody>
          <div className="flex flex-col gap-4">
            {unfinishedExperiments.map((experiment) => (
              <div
                key={experiment.frequency}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
              >
                <div>
                  <Text className="font-semibold">{experiment.title}</Text>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleStartExperiment(experiment.frequency)}
                >
                  Start experiment
                </Button>
              </div>
            ))}
          </div>
        </DialogBody>

        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => {
              setModalOpen(false)
              setHasBeenDismissed(true)
            }}
          >
            Maybe later
          </Button>
        </DialogActions>
      </Dialog>

      {selectedFrequency !== null && (
        <SurveyMachineProvider
          meanFrequency={selectedFrequency}
          userSettings={userSettings.data.userSettings[0]}
        >
          <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
        </SurveyMachineProvider>
      )}
    </>
  )
}
