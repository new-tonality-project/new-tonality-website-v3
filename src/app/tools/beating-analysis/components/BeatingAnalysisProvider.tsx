'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { db } from '@/db'
import {
  BEATING_ANALYSIS_DEFAULT_PRESET_ID,
  debounceTransaction,
  defaultPresetMeta,
} from '@/lib'
import { useEnsureDefaultPreset } from '@/hooks/useEnsureDefaultPreset'
import {
  DEFAULT_BEATING_ANALYSIS_STATE,
  mapBeatingAnalysisRecordToState,
  toPersistedBeatingAnalysisSettings,
  useSyncBeatingAnalysisSettings,
  type BeatingAnalysisState,
} from './useSyncBeatingAnalysisSettings'

export type { BeatingAnalysisState }

const persistSettings = debounceTransaction(
  (settingsId: string, settings: BeatingAnalysisState) => {
    db.transact(
      db.tx.beatingAnalysisSettings[settingsId].update({
        ...toPersistedBeatingAnalysisSettings(settings),
        updatedAt: Date.now(),
      }),
    )
  },
)

const createDefaultPreset = () =>
  db.transact(
    db.tx.beatingAnalysisPresets[BEATING_ANALYSIS_DEFAULT_PRESET_ID].update({
      ...defaultPresetMeta(),
      ...toPersistedBeatingAnalysisSettings(DEFAULT_BEATING_ANALYSIS_STATE),
    }),
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

  const { isLoading: queryLoading, data } = db.useQuery({
    beatingAnalysisSettings: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
    beatingAnalysisPresets: {
      $: {
        where: {
          id: BEATING_ANALYSIS_DEFAULT_PRESET_ID,
        },
      },
    },
  })

  const settingsRecord = data?.beatingAnalysisSettings[0]
  const defaultPreset = data?.beatingAnalysisPresets[0]
  const { isReady } = useEnsureDefaultPreset({
    queryLoading,
    record: defaultPreset,
    create: createDefaultPreset,
  })

  const getCreateState = useCallback(
    () =>
      defaultPreset
        ? mapBeatingAnalysisRecordToState(defaultPreset)
        : DEFAULT_BEATING_ANALYSIS_STATE,
    [defaultPreset],
  )

  const settingsIdRef = useSyncBeatingAnalysisSettings({
    userId: user.id,
    settingsRecord,
    isLoading: !isReady,
    setSettings,
    getCreateState,
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
      value={{ settings, update, isLoading: queryLoading || !isReady }}
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
