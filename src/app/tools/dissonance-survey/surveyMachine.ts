import { SurveyIntervals } from '@/classes'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { assign, setup } from 'xstate'
import { getIntervalFrequencies } from './utils'

const machineSetup = setup({
  types: {
    context: {} as {
      title: string
      description: string
      shareAnonymously: boolean
      sharePublicly: boolean
      musicalBackground: string

      intervals?: SurveyIntervals
      synth?: AdditiveSynth
      isPlaying: boolean
      canRate: boolean
      canListen: boolean
      canStartExperiment: boolean
      currentIndex: number
      medianFrequency: number
    },
    events: {} as
      | {
          type: 'setShareAnonymously'
          value: boolean
        }
      | {
          type: 'setSharePublicly'
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
          type: 'submitSurvey'
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
      | { type: 'testVolume' },
  },
})

const defaultContext = {
  title: '',
  description: '',
  shareAnonymously: false,
  sharePublicly: false,
  musicalBackground: '',
  intervals: undefined,
  synth: undefined,
  isPlaying: false,
  canRate: false,
  canListen: false,
  canStartExperiment: false,
  currentIndex: 0,
  medianFrequency: 440,
}

export const surveyMachine = machineSetup.createMachine({
  context: defaultContext,
  initial: 'overview',
  on: {
    exitSurvey: {
      target: '.overview',
      actions: assign(defaultContext),
    },
  },
  states: {
    overview: {
      entry: assign({
        title: 'Overview',
        description: '',
      }),
      on: {
        toQuestions: {
          target: 'questions',
        },
      },
    },
    questions: {
      entry: assign({
        title: 'Preliminary questions',
        description:
          'Before we start, please answer following questions so we know how to process your data.',
      }),
      on: {
        toListening: {
          target: 'listening',
        },
        setShareAnonymously: {
          actions: assign({
            shareAnonymously: ({ event }) => event.value,
          }),
        },
        setSharePublicly: {
          actions: assign({
            sharePublicly: ({ event }) => event.value,
          }),
        },
        setMusicalBackground: {
          actions: assign({
            musicalBackground: ({ event }) => event.value,
          }),
        },
      },
    },
    listening: {
      entry: assign(() => ({
        title: 'Preliminary listening',
        description:
          'Now you will be presented with a set of intervals that you will have to rate so you have the idea on show rough do they sound.',
        intervals: new SurveyIntervals(),
        synth:
          typeof AudioContext !== 'undefined'
            ? new AdditiveSynth({
                spectrum: [{ partials: [{ rate: 1, amplitude: 0.2 }] }],
                audioContext: new AudioContext(),
                adsr: { attack: 0.1, sustain: 1, release: 0.1, decay: 0 },
              })
            : undefined,
      })),
      on: {
        toExperiment: {
          target: 'experiment',
        },
        toggleCanListen: {
          actions: assign({
            canListen: true,
          }),
        },
        toggleCanStartExperiment: {
          actions: assign({
            canStartExperiment: true,
          }),
        },

        playInterval: {
          actions: [
            assign({
              isPlaying: true,
            }),
            ({ context, event }) => {
              if (!context.synth) return

              const [f1, f2] = getIntervalFrequencies(
                event.value,
                context.medianFrequency,
              )

              context.synth.releaseAll()

              context.synth.play({ pitch: f1, velocity: 0.5 })
              context.synth.play({ pitch: f2, velocity: 0.5 })
            },
          ],
        },
        releaseAll: {
          actions: [
            ({ context }) => {
              if (!context.synth || !context.isPlaying) return

              context.synth.releaseAll()
            },
            assign({
              isPlaying: false,
            }),
          ],
        },
      },
    },
    experiment: {
      entry: assign(() => {
        return {
          title: 'Experiment',
          description:
            'Now you will be presented with 36 intervals that you will have to rate on show rough do they sound.',
        }
      }),

      on: {
        rateInterval: {
          actions: [
            ({ context, event }) => {
              if (!context.intervals) return

              context.intervals.rateInterval(event.value)
            },
            ({ context }) => {
              context.synth?.releaseAll()
            },
            assign(({ context }) => ({
              currentIndex: context.currentIndex + 1,
              canRate: false,
              isPlaying: false,
            })),
          ],
        },
        submitSurvey: {
          target: 'submitting',
        },
        playInterval: {
          actions: [
            assign({
              isPlaying: true,
              canRate: true,
            }),
            ({ context, event }) => {
              if (!context.synth) return

              const [f1, f2] = getIntervalFrequencies(
                event.value,
                context.medianFrequency,
              )

              context.synth.releaseAll()

              context.synth.play({ pitch: f1, velocity: 0.5 })
              context.synth.play({ pitch: f2, velocity: 0.5 })
            },
          ],
        },
        releaseAll: {
          actions: [
            ({ context }) => {
              if (!context.synth || !context.isPlaying) return

              context.synth.releaseAll()
            },
            assign({
              isPlaying: false,
            }),
          ],
        },
      },
    },
    submitting: {
      entry: assign({
        title: 'Submitting',
        description: 'Thank you for your time.',
      }),
    },
  },
})
