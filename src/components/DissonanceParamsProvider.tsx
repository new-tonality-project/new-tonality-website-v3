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
  DEFAULT_DISSONANCE_PARAMS_STATE,
  mapDissonanceParamsRecordToState,
  toPersistedDissonanceParams,
  type DissonanceParamsState,
} from '@/lib/dissonanceParams'
import { useSyncLinkedSettings } from '@/hooks/useSyncLinkedSettings'

export type { DissonanceParamsState }

const persistParams = debounceTransaction(
  (paramsId: string, settings: DissonanceParamsState) => {
    db.transact(
      db.tx.dissonanceParams[paramsId].update({
        ...toPersistedDissonanceParams(settings),
        updatedAt: Date.now(),
      }),
    )
  },
)

type DissonanceParamsContextValue = {
  settings: DissonanceParamsState
  update: (partial: Partial<DissonanceParamsState>) => void
  isLoading: boolean
}

const DissonanceParamsContext = createContext<DissonanceParamsContextValue | null>(
  null,
)

export function DissonanceParamsProvider({ children }: { children: ReactNode }) {
  const user = db.useUser()
  const [settings, setSettings] = useState(DEFAULT_DISSONANCE_PARAMS_STATE)

  const { isLoading, data } = db.useQuery({
    dissonanceParams: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
  })

  const paramsRecord = data?.dissonanceParams[0]

  const getCreateState = useCallback(() => DEFAULT_DISSONANCE_PARAMS_STATE, [])

  const createRecord = useCallback(
    (newId: string, userId: string, state: DissonanceParamsState) => {
      const now = Date.now()

      return db.transact(
        db.tx.dissonanceParams[newId]
          .update({
            ...toPersistedDissonanceParams(state),
            createdAt: now,
            updatedAt: now,
          })
          .link({
            $users: userId,
          }),
      )
    },
    [],
  )

  const paramsIdRef = useSyncLinkedSettings({
    userId: user.id,
    record: paramsRecord,
    isLoading,
    setState: setSettings,
    mapRecordToState: mapDissonanceParamsRecordToState,
    getCreateState,
    createRecord,
  })

  const update = useCallback((partial: Partial<DissonanceParamsState>) => {
    setSettings((current) => {
      const next = { ...current, ...partial }
      const paramsId = paramsIdRef.current

      if (paramsId) {
        persistParams(paramsId, next)
      }

      return next
    })
  }, [])

  return (
    <DissonanceParamsContext.Provider
      value={{ settings, update, isLoading }}
    >
      {children}
    </DissonanceParamsContext.Provider>
  )
}

export function useDissonanceParams() {
  const context = useContext(DissonanceParamsContext)

  if (!context) {
    throw new Error(
      'useDissonanceParams must be used within DissonanceParamsProvider',
    )
  }

  return context
}
