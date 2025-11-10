'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useMachine } from '@xstate/react'
import { surveyMachine } from './machine'
import { db } from '@/db'
import type { UserSettings } from '@/lib'

const SurveyMachineContext = createContext<ReturnType<
  typeof useMachine<typeof surveyMachine>
> | null>(null)

export function SurveyMachineProvider({
  children,
  meanFrequency,
  userSettings,
}: {
  children: ReactNode
  meanFrequency: number
  userSettings: UserSettings
}) {
  const machine = useMachine(surveyMachine, {
    input: {
      meanFrequency,
      userSettings
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
