'use client'

import { Button } from '@/components'
import { useSurveyMachine } from '@/state/machines'
import { Text } from '@/components/catalyst/text'
import { Step } from '@/components/Step'
import { useState } from 'react'

export function SurveyListening() {
  const [state, send] = useSurveyMachine()
  const [intervalsListened, setIntervalsListened] = useState<number>(0)
  const [isListening, setIsListening] = useState<boolean>(false)

  async function testVolume() {
    if (!state.context.intervals || !state.context.synth) {
      console.error('No intervals or synth found')
      return
    }

    send({ type: 'playInterval', value: 702 })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    send({ type: 'releaseAll' })
    send({ type: 'toggleCanListen' })
  }

  async function playIntervals() {
    if (!state.context.intervals || !state.context.synth) {
      console.error('No intervals or synth found')
      return
    }
    setIsListening(true)
    const shuffled = state.context.intervals.getShuffledBatch(
      state.context.intervals.values,
    )

    let index = 0
    for (const interval of shuffled) {
      send({ type: 'playInterval', value: interval })

      index++
      setIntervalsListened(index)

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    send({ type: 'releaseAll' })
    send({ type: 'toggleCanStartExperiment' })
    setIsListening(false)
  }

  return (
    <div className='pt-8 lg:pt-0'>
      <Step className="pt-8" title="Step" number={1} disabled={false}>
        <Text>
          Make sure you use headphones or monitoring speakers. Laptop or phone
          speakers, even good Macbook Pro ones, produce a lot of distorion and
          are introducing new harmonics that will impact the results of the
          survey. Press "Test volume" to make sure you can hear the interval
          clearly at a comfortable volume.
        </Text>
        <Button
          className="my-6"
          disabled={state.context.isPlaying}
          onClick={testVolume}
        >
          Test volume
        </Button>
      </Step>
      <Step
        className="mb-8"
        title="Step"
        number={2}
        disabled={!state.context.canListen}
      >
        <Text>
          Before you start rating the intervals you need to have the relative
          idea of what intervals sound very rough and should be rated as 7 or
          very smooth and should be rated as 1. Press "Listen to intervals" to
          hear the 14 intervals that will be used in the survey and understand
          how they sound to you.
        </Text>
        <Button
          className="my-6"
          disabled={state.context.isPlaying}
          onClick={playIntervals}
        >
          {isListening
            ? 'Listening...'
            : state.context.canStartExperiment
              ? 'Listen again'
              : 'Listen to intervals'}
        </Button>
        <Text>
          {intervalsListened} / {state.context.intervals?.values.length}{' '}
          intervals listened
        </Text>
      </Step>

      <Step
        title="Step"
        number={3}
        disabled={!state.context.canStartExperiment}
      >
        <Text>
          Press "Continue" to proceed to the survey where you will rate the
          intervals that you have just heard.
        </Text>
      </Step>
    </div>
  )
}
