import { assign, setup } from 'xstate'

const machineSetup = setup({
  types: {
    context: {} as {
      title: string
      description: string
      shareAnonymously: boolean
      sharePublicly: boolean
      musicalBackground: string
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
      | { type: 'exitSurvey' },
  },
})

export const surveyMachine = machineSetup.createMachine({
  context: {
    title: '',
    description: '',
    shareAnonymously: false,
    sharePublicly: false,
    musicalBackground: '',
  },
  initial: 'overview',
  on: {
    exitSurvey: {
      target: '.overview',
      actions: assign({
        title: '',
        description: '',
        shareAnonymously: false,
        sharePublicly: false,
        musicalBackground: '',
      }),
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
        toExperiment: {
          target: 'experiment',
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
    experiment: {
      entry: assign({
        title: 'Experiment',
        description: 'Rate the consonance of the intervals you hear',
      }),
    },
  },
})
