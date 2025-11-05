'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useMachine } from '@xstate/react'
import { surveyMachine } from './machine'

const SurveyMachineContext = createContext<ReturnType<
  typeof useMachine<typeof surveyMachine>
> | null>(null)

export function SurveyMachineProvider({
  children,
  meanFrequency,
}: {
  children: ReactNode
  meanFrequency: number
}) {
  const machine = useMachine(surveyMachine, {
    input: {
      meanFrequency,
    },
  })

  return (
    <SurveyMachineContext.Provider value={machine}>
      {children}
    </SurveyMachineContext.Provider>
  )
}

export function useSurveyMachine() {
  const context = useContext(SurveyMachineContext)

  if (!context) {
    throw new Error(
      'useSurveyMachine must be used within a SurveyMachineProvider',
    )
  }

  return context
}
