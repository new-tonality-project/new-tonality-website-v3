import { assign, setup } from 'xstate'

const machineSetup = setup({
  types: {
    context: {} as {
      title: string
      description: string
      shareAnonymously: boolean
      sharePublicly: boolean
    },
    events: {} as {
      type: 'acceptDisclamer'
      value: { shareAnonymously: boolean; sharePublicly: boolean }
    },
  },
})

export const surveyMachine = machineSetup.createMachine({
  context: {
    title: 'Dissonance Survey',
    description:
      'To take part in this survey, you have to agree that we can store and process your results.',
    shareAnonymously: false,
    sharePublicly: false,
  },
  initial: 'disclamer',
  states: {
    disclamer: {
      on: {
        acceptDisclamer: {
          target: 'start',
          actions: assign({
            shareAnonymously: ({ event }) => event.value.shareAnonymously,
            sharePublicly: ({ event }) => event.value.sharePublicly,
          }),
        },
      },
    },
    start: {
      entry: assign({
        title: 'Start',
        description: 'Description of the start',
      }),
    },
  },
})
