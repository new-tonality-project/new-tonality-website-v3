import { assign } from 'xstate'
import { defaultContext, machineSetup } from './setup'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { SurveyIntervals } from '@/classes'
import {
  getIntervalFrequencies,
  MusicalBackground,
  type UserSettings,
} from '@/lib'

function getMusicalBackground(
  userSettings?: UserSettings,
): MusicalBackground | undefined {
  if (userSettings?.isMicrotonalist) return MusicalBackground.Microtonalist
  if (userSettings?.isMusician) return MusicalBackground.Musician
  if (userSettings?.isNaiveListener) return MusicalBackground.NaiveListener
  return
}

// TODO: when exiting survey we get questions reset to defaultContext rather than data from BE. Need to fix this.

export const surveyMachine = machineSetup.createMachine({
  context: ({ input }) => ({
    ...defaultContext,
    meanFrequency: input.meanFrequency,
    shareDataPrivately:
      input.userSettings?.shareDataPrivately ??
      defaultContext.shareDataPrivately,
    shareDataPublicly:
      input.userSettings?.shareDataPublicly ?? defaultContext.shareDataPublicly,
    musicalBackground:
      getMusicalBackground(input.userSettings) ??
      defaultContext.musicalBackground,
  }),
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
        setshareDataPrivately: {
          actions: assign({
            shareDataPrivately: ({ event }) => event.value,
          }),
        },
        setshareDataPublicly: {
          actions: assign({
            shareDataPrivately: ({ event }) => event.value,
            shareDataPublicly: ({ event }) => event.value,
          }),
        },
        setMusicalBackground: {
          actions: assign({
            musicalBackground: ({ event }) => {
              const val = parseInt(event.value)

              if (
                val === MusicalBackground.Microtonalist ||
                val === MusicalBackground.Musician ||
                val === MusicalBackground.NaiveListener
              ) {
                return val
              }

              throw new Error('Invalid musical backgroun value')
            },
          }),
        },
      },
    },
    listening: {
      entry: assign(() => ({
        title: 'Preliminary listening',
        description:
          'We are almost ready to start the survey. But before rating the intervals, we need to make sure your sound is ok and you have the idea how the intervals that will be used in the survey sound to you.',
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
                context.meanFrequency,
              )

              context.synth.releaseAll()

              if (f1 !== f2) {
                context.synth.play({ pitch: f1, velocity: 0.5 })
                context.synth.play({ pitch: f2, velocity: 0.5 })
              } else {
                context.synth.play({ pitch: f1, velocity: 0.5 })
              }
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
          title: 'Rating the intervals',
          description:
            "It is time to rate the intervals! Each of the 14 intervals that you've heard in a previous step will be played 3 times in a random order. So in total you will rate 42 intervals.",
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
                context.meanFrequency,
              )

              context.synth.releaseAll()

              if (f1 !== f2) {
                context.synth.play({ pitch: f1, velocity: 0.5 })
                context.synth.play({ pitch: f2, velocity: 0.5 })
              } else {
                context.synth.play({ pitch: f1, velocity: 0.5 })
              }
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
        success: {
          target: 'success',
        },
        error: {
          target: 'error',
        },
      },
    },

    success: {
      entry: assign({
        title: 'Success',
        description: 'Thank you for your time.',
      }),
    },
    error: {
      entry: assign({
        title: 'Error',
        description: 'There was an error submitting your survey.',
      }),
    },
  },
})
