'use client'

import { Button } from '@/components'
import { useSurveyMachine } from '@/state/machines'
import { useMemo, useRef, useState } from 'react'
import { Text } from '@/components/catalyst/text'
import { Step } from '@/components/Step'
import { db } from '@/db'
import { submitSurvey } from '../actions'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import clsx from 'clsx'

const COLORS = [
  '#E2E8F0',
  '#E7E4EB',
  '#ECDFE6',
  '#F1DAE1',
  '#F6D5DC',
  '#FBD0D7',
  '#FFCCD3',
]

export function SurveyExperiment() {
  const [state, send] = useSurveyMachine()
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const releaseNoteTimeout = useRef<NodeJS.Timeout | null>(null)
  const user = db.useUser()

  const surveyLength = state.context.intervals?.surveyOrder.length ?? 0

  const currentInterval = useMemo(() => {
    return state.context.intervals?.surveyOrder[state.context.currentIndex]
  }, [state.context.intervals, state.context.currentIndex])

  const numberOfIntervals = useMemo(() => {
    return state.context.intervals?.surveyOrder.length ?? 0
  }, [state.context.intervals?.surveyOrder.length])

  const currentIndex = useMemo(() => {
    return state.context.currentIndex ?? 0
  }, [state.context.currentIndex])

  const isFinished = useMemo(() => {
    if (!state.context.intervals) return false

    return (
      state.context.currentIndex ===
      surveyLength - 1
    )
  }, [state.context.currentIndex, state.context.intervals, surveyLength])

  async function submit() {
    try {
      if (!state.context.intervals)
        throw new Error('Cannot submit experiment: no intervals found')

      setSubmitting(true)

      await submitSurvey({
        scores: state.context.intervals.scores,
        shareDataPrivately: state.context.shareDataPrivately,
        shareDataPublicly: state.context.shareDataPublicly,
        musicalBackground: state.context.musicalBackground,
        meanFrequency: state.context.meanFrequency,
        userId: user.id,
      })
      send({ type: 'success' })
    } catch (error) {
      // TODO: Save survey locally so that it can be submitted later
      console.error(error)
      send({ type: 'error' })
    }
  }

  if (
    currentInterval === undefined ||
    state.context.synth === undefined ||
    state.context.intervals === undefined
  )
    return null

  return (
    <div className={clsx('relative', submitting && 'pointer-events-none')}>
      {submitting && <LoadingOverlay />}
      <Step className="mb-8" title="Step" number={1} disabled={false}>
        <Text className="pb-6">
          Press &quot;Play Interval&quot; to hear the interval.
        </Text>
        {state.context.isPlaying ? (
          <Button
            onClick={() => {
              send({
                type: 'releaseAll',
              })

              if (releaseNoteTimeout.current)
                clearTimeout(releaseNoteTimeout.current)
            }}
          >
            Stop playing {currentIndex + 1} / {numberOfIntervals}
          </Button>
        ) : (
          <Button
            onClick={() => {
              send({
                type: 'playInterval',
                value: currentInterval,
              })

              releaseNoteTimeout.current = setTimeout(() => {
                send({
                  type: 'releaseAll',
                })
              }, 5000)
            }}
          >
            Play Interval {currentIndex + 1} / {numberOfIntervals}
          </Button>
        )}
      </Step>

      <Step className="mb-8" title="Step" number={2} disabled={false}>
        <Text className="pb-2">
          Choose the number between 1 and 7 to rate how rough the interval
          sounds to you, where 7 is the roughest and 1 is the smoothest.
        </Text>
        <div className="pt-6 pb-4 md:w-sm">
          <div className="flex justify-between pb-2">
            <Text>Smooth</Text>
            <Text>Rough</Text>
          </div>

          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((rating) => {
              return (
                <Button
                  disabled={!state.context.canRate}
                  variant={selectedRating === rating ? 'primary' : 'secondary'}
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className="border px-4"
                  style={
                    selectedRating !== rating
                      ? {
                          backgroundColor: `${COLORS[rating - 1]}77`,
                          borderColor: COLORS[rating - 1],
                        }
                      : {}
                  }
                >
                  {rating}
                </Button>
              )
            })}
          </div>
        </div>
      </Step>

      <Step className="mb-8" title="Step" number={3} disabled={false}>
        <Text className="pb-6">
          Once you&apos;ve rated the interval, press &quot;Next interval&quot; to move to the
          next interval.
        </Text>

        {isFinished ? (
          <Button
            variant="primary"
            disabled={selectedRating === null}
            onClick={() => {
              if (selectedRating === null) return

              send({
                type: 'rateInterval',
                value: { interval: currentInterval, rating: selectedRating },
              })

              submit()
            }}
          >
            Finish the experiment!
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={selectedRating === null}
            onClick={() => {
              if (selectedRating === null) return
              send({
                type: 'rateInterval',
                value: { interval: currentInterval, rating: selectedRating },
              })
              setSelectedRating(null)
              if (releaseNoteTimeout.current)
                clearTimeout(releaseNoteTimeout.current)
            }}
          >
            Next interval
          </Button>
        )}
      </Step>
    </div>
  )
}
