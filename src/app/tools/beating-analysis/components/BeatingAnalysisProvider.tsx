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
import {
  DEFAULT_BEATING_ANALYSIS_STATE,
  useSyncBeatingAnalysisSettings,
  type BeatingAnalysisState,
} from './useSyncBeatingAnalysisSettings'

export type { BeatingAnalysisState }

const persistSettings = debounceTransaction(
  (settingsId: string, settings: BeatingAnalysisState) => {
    db.transact(
      db.tx.beatingAnalysisSettings[settingsId].update({
        ...settings,
        updatedAt: Date.now(),
      }),
    )
  },
)

type BeatingAnalysisContextValue = {
  settings: BeatingAnalysisState
  update: (partial: Partial<BeatingAnalysisState>) => void
  isLoading: boolean
}

const BeatingAnalysisContext = createContext<BeatingAnalysisContextValue | null>(
  null,
)

export function BeatingAnalysisProvider({ children }: { children: ReactNode }) {
  const user = db.useUser()
  const [settings, setSettings] = useState(DEFAULT_BEATING_ANALYSIS_STATE)

  const { isLoading, data } = db.useQuery({
    beatingAnalysisSettings: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
  })

  const settingsRecord = data?.beatingAnalysisSettings[0]
  const settingsIdRef = useSyncBeatingAnalysisSettings({
    userId: user.id,
    settingsRecord,
    isLoading,
    setSettings,
  })

  const update = useCallback((partial: Partial<BeatingAnalysisState>) => {
    setSettings((current) => {
      const next = { ...current, ...partial }
      const settingsId = settingsIdRef.current

      if (settingsId) {
        persistSettings(settingsId, next)
      }

      return next
    })
  }, [])

  return (
    <BeatingAnalysisContext.Provider
      value={{ settings, update, isLoading }}
    >
      {children}
    </BeatingAnalysisContext.Provider>
  )
}

export function useBeatingAnalysisSettings() {
  const context = useContext(BeatingAnalysisContext)

  if (!context) {
    throw new Error(
      'useBeatingAnalysisSettings must be used within BeatingAnalysisProvider',
    )
  }

  return context
}
