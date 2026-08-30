'use client'

import { useEffect, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from 'react'
import { id } from '@instantdb/react'

export function useSyncLinkedSettings<
  TRecord extends { id: string },
  TState,
>({
  userId,
  isLoading,
  record,
  setState,
  mapRecordToState,
  getCreateState,
  createRecord,
}: {
  userId: string
  isLoading: boolean
  record: TRecord | undefined
  setState: Dispatch<SetStateAction<TState>>
  mapRecordToState: (record: TRecord) => TState
  getCreateState: () => TState
  createRecord: (
    newId: string,
    userId: string,
    state: TState,
  ) => Promise<unknown>
}): MutableRefObject<string | null> {
  const idRef = useRef<string | null>(null)
  const hasSyncedFromServer = useRef(false)
  const isCreating = useRef(false)

  useEffect(() => {
    if (isLoading) return

    if (record) {
      idRef.current = record.id
      isCreating.current = false

      if (!hasSyncedFromServer.current) {
        setState(mapRecordToState(record))
        hasSyncedFromServer.current = true
      }

      return
    }

    if (isCreating.current) return

    isCreating.current = true
    const newId = id()
    idRef.current = newId
    const createdState = getCreateState()
    setState(createdState)
    hasSyncedFromServer.current = true

    createRecord(newId, userId, createdState).catch(() => {
      isCreating.current = false
      idRef.current = null
      hasSyncedFromServer.current = false
    })
  }, [
    isLoading,
    record,
    userId,
    setState,
    mapRecordToState,
    getCreateState,
    createRecord,
  ])

  return idRef
}
