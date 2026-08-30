'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { db } from '@/db'
import { debounceTransaction } from '@/lib'
import type { SensoryDissonanceAnalysisState } from './types'
import {
  DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE,
  toPersistedSensoryDissonanceAnalysisSettings,
  useSyncSensoryDissonanceAnalysisSettings,
} from './useSyncSensoryDissonanceAnalysisSettings'

export type { SensoryDissonanceAnalysisState }

const persistSettings = debounceTransaction(
  (settingsId: string, settings: SensoryDissonanceAnalysisState) => {
    db.transact(
      db.tx.sensoryDissonanceAnalysisSettings[settingsId].update({
        ...toPersistedSensoryDissonanceAnalysisSettings(settings),
        updatedAt: Date.now(),
      }),
    )
  },
)

type SensoryDissonanceAnalysisContextValue = {
  settings: SensoryDissonanceAnalysisState
  update: (partial: Partial<SensoryDissonanceAnalysisState>) => void
  isLoading: boolean
}

const SensoryDissonanceAnalysisContext =
  createContext<SensoryDissonanceAnalysisContextValue | null>(null)

export function SensoryDissonanceAnalysisProvider({
  children,
}: {
  children: ReactNode
}) {
  const user = db.useUser()
  const [settings, setSettings] = useState(
    DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE,
  )

  const { isLoading, data } = db.useQuery({
    sensoryDissonanceAnalysisSettings: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
  })

  const settingsRecord = data?.sensoryDissonanceAnalysisSettings[0]
  const settingsIdRef = useSyncSensoryDissonanceAnalysisSettings({
    userId: user.id,
    settingsRecord,
    isLoading,
    setSettings,
  })

  const update = useCallback(
    (partial: Partial<SensoryDissonanceAnalysisState>) => {
      setSettings((current) => {
        const next = { ...current, ...partial }
        const settingsId = settingsIdRef.current

        if (settingsId) {
          persistSettings(settingsId, next)
        }

        return next
      })
    },
    [],
  )

  return (
    <SensoryDissonanceAnalysisContext.Provider
      value={{ settings, update, isLoading }}
    >
      {children}
    </SensoryDissonanceAnalysisContext.Provider>
  )
}

export function useSensoryDissonanceAnalysisSettings() {
  const context = useContext(SensoryDissonanceAnalysisContext)

  if (!context) {
    throw new Error(
      'useSensoryDissonanceAnalysisSettings must be used within SensoryDissonanceAnalysisProvider',
    )
  }

  return context
}
