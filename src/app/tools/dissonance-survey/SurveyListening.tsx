'use client'

import { Button } from '@/components'
import { useSurveyMachine } from './useSurveyMachine'
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
    const shuffled = state.context.intervals.getShuffledIntervals(
      state.context.intervals.surveyOrder[0],
    )

    let index = 0
    for (const interval of shuffled) {
      send({ type: 'playInterval', value: interval })

      await new Promise((resolve) => setTimeout(resolve, 2000))
      index++
      setIntervalsListened(index)
    }

    send({ type: 'releaseAll' })
    send({ type: 'toggleCanStartExperiment' })
    setIsListening(false)
  }

  return (
    <div>
      <Step className="mb-8" title="Step" number={1} disabled={false}>
        <Text>
          We almost ready to start the survey. Make sure you use headphones or
          decent speakers. Press "Test volume" to make sure you can hear the
          intervals clearly at a comfortable volume.
        </Text>
        <Button
          className="my-6"
          disabled={state.context.isPlaying}
          onClick={testVolume}
        >
          Test volume
        </Button>
      </Step>
      <Step className="mb-8" title="Step" number={2} disabled={!state.context.canListen}>
        <Text>
          Once you've confirmed you can hear the intervals clearly, press
          "Listen to intervals" to get the idea how rough they sound to you so
          you can rate them correctly in the survey.
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
        <Text>{intervalsListened} / 12 intervals listened</Text>
      </Step>

      <Step
        title="Step"
        number={3}
        disabled={!state.context.canStartExperiment}
      >
        <Text>Press "Continue" to proceed to the survey.</Text>
      </Step>
    </div>
  )
}
