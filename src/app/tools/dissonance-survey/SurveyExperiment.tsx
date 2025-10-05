import { Button } from '@/components'
import { useSurveyMachine } from './useSurveyMachine'
import { useMemo, useRef, useState } from 'react'
import { Strong, Text } from '@/components/catalyst/text'
import { Step } from '@/components/Step'

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
  const releaseNoteTimeout = useRef<NodeJS.Timeout | null>(null)

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
      state.context.currentIndex === state.context.intervals?.surveyOrder.length - 1
    )
  }, [state.context.currentIndex, state.context.intervals?.surveyOrder.length])

  if (
    currentInterval === undefined ||
    state.context.synth === undefined ||
    state.context.intervals === undefined
  )
    return null

  return (
    <>
      <Step className="mb-8" title="Step" number={1} disabled={false}>
        <Text className="pb-6">
          Press "Play Interval" to hear the interval.
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
        <div className="w-sm pt-6 pb-4">
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
          Once you've rated the interval, press "Next interval" to move to the
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
              send({
                type: 'submitSurvey',
              })
            }}
          >
            Finish the Survey!
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
    </>
  )
}
