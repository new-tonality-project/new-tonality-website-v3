import { Button } from '@/components'
import { useSurveyMachine } from './useSurveyMachine'
import { useMemo, useRef, useState } from 'react'
import { Strong, Text } from '@/components/catalyst/text'

export function SurveyExperiment() {
  const [state, send] = useSurveyMachine()
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const releaseNoteTimeout = useRef<NodeJS.Timeout | null>(null)

  const currentInterval = useMemo(() => {
    return state.context.intervals?.surveyOrder[state.context.currectIndex]
  }, [state.context.intervals, state.context.currectIndex])

  const progress = useMemo(() => {
    if (!state.context.intervals?.surveyOrder.length) return '...'

    return `${state.context.currectIndex} / ${state.context.intervals?.surveyOrder.length}`
  }, [state.context.currectIndex, state.context.intervals?.surveyOrder.length])

  const isFinished = useMemo(() => {
    if (!state.context.intervals) return false

    return (
      state.context.currectIndex === state.context.intervals?.surveyOrder.length
    )
  }, [state.context.currectIndex, state.context.intervals?.surveyOrder.length])

  if (
    currentInterval === undefined ||
    state.context.synth === undefined ||
    state.context.intervals === undefined
  )
    return null

  return (
    <div>
      <Text className="pb-2">
        1. Press "Play Interval" to hear the interval.
      </Text>
      <Text className="pb-2">
        2. Choose the number between 1 and 7 to rate how rough the interval
        sounds to you, where 7 is the roughest and 1 is the smoothest.
      </Text>
      <Text className="pb-12">
        3. Once you've rated the interval, press "Next interval" to move to the
        next interval.
      </Text>

      <div className="mx-auto w-sm pt-8 pb-12">
        <Text className="flex gap-2 pb-4">
          <Strong>Progress: {progress}</Strong>
        </Text>

        <div className="flex justify-between pb-2">
          <Text>Smooth</Text>
          <Text>Rough</Text>
        </div>

        <div className="flex justify-between pb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((rating) => {
            return (
              <Button
                disabled={!state.context.canRate}
                variant={selectedRating === rating ? 'primary' : 'secondary'}
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className="border border-zinc-300 px-4"
              >
                {rating}
              </Button>
            )
          })}
        </div>

        <div className="flex w-full justify-between pb-12">
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
              Stop playing
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
              Play Interval
            </Button>
          )}

          {isFinished ? (
            <Button
              variant="primary"
              disabled={selectedRating === null}
              onClick={() => {
                if (selectedRating === null) return
                send({
                  type: 'submitSurvey',
                  value: { interval: currentInterval, rating: selectedRating },
                })
              }}
            >
              Next interval
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
        </div>
      </div>
    </div>
  )
}
