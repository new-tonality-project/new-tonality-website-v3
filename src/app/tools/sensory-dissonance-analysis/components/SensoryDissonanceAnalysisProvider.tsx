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
  SENSORY_DISSONANCE_DEFAULT_PRESET_ID,
  debounceTransaction,
  defaultPresetMeta,
} from '@/lib'
import { useEnsureDefaultPreset } from '@/hooks/useEnsureDefaultPreset'
import type { SensoryDissonanceAnalysisState } from './types'
import {
  DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE,
  mapSensoryDissonanceAnalysisRecordToState,
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

const createDefaultPreset = () =>
  db.transact(
    db.tx.sensoryDissonanceAnalysisPresets[
      SENSORY_DISSONANCE_DEFAULT_PRESET_ID
    ].update({
      ...defaultPresetMeta(),
      ...toPersistedSensoryDissonanceAnalysisSettings(
        DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE,
      ),
    }),
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

  const { isLoading: queryLoading, data } = db.useQuery({
    sensoryDissonanceAnalysisSettings: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
    sensoryDissonanceAnalysisPresets: {
      $: {
        where: {
          id: SENSORY_DISSONANCE_DEFAULT_PRESET_ID,
        },
      },
    },
  })

  const settingsRecord = data?.sensoryDissonanceAnalysisSettings[0]
  const defaultPreset = data?.sensoryDissonanceAnalysisPresets[0]
  const { isReady } = useEnsureDefaultPreset({
    queryLoading,
    record: defaultPreset,
    create: createDefaultPreset,
  })

  const getCreateState = useCallback(
    () =>
      defaultPreset
        ? mapSensoryDissonanceAnalysisRecordToState(defaultPreset)
        : DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE,
    [defaultPreset],
  )

  const settingsIdRef = useSyncSensoryDissonanceAnalysisSettings({
    userId: user.id,
    settingsRecord,
    isLoading: !isReady,
    setSettings,
    getCreateState,
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
      value={{ settings, update, isLoading: queryLoading || !isReady }}
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
