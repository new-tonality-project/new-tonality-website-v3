import { SurveyIntervals } from '@/classes'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { setup } from 'xstate'
import { MusicalBackground } from '@/lib'

export const defaultContext = {
  title: '',
  description: '',
  shareDataPrivately: false,
  shareDataPublicly: false,
  musicalBackground: MusicalBackground.NaiveListener,
  intervals: undefined,
  synth: undefined,
  isPlaying: false,
  canRate: false,
  canListen: false,
  canStartExperiment: false,
  currentIndex: 0,
  meanFrequency: 440,
}

export const machineSetup = setup({
  types: {
    input: {} as {
      meanFrequency: number
    },
    context: {} as {
      title: string
      description: string
      shareDataPrivately: boolean
      shareDataPublicly: boolean
      musicalBackground: MusicalBackground

      intervals?: SurveyIntervals
      synth?: AdditiveSynth
      isPlaying: boolean
      canRate: boolean
      canListen: boolean
      canStartExperiment: boolean
      currentIndex: number
      meanFrequency: number
    },
    events: {} as
      | {
          type: 'setshareDataPrivately'
          value: boolean
        }
      | {
          type: 'setshareDataPublicly'
          value: boolean
        }
      | {
          type: 'setMusicalBackground'
          value: string
        }
      | {
          type: 'toQuestions'
        }
      | {
          type: 'toExperiment'
        }
      | { type: 'exitSurvey' }
      | {
          type: 'rateInterval'
          value: {
            interval: number
            rating: number
          }
        }
      | {
          type: 'playInterval'
          value: number
        }
      | {
          type: 'releaseAll'
        }
      | {
          type: 'toggleCanListen'
        }
      | {
          type: 'toggleCanStartExperiment'
        }
      | { type: 'toListening' }
      | { type: 'testVolume' }
      | { type: 'success' }
      | { type: 'error' },
  },
})
