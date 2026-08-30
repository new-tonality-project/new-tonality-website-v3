'use client'

import { useEffect, useRef, useState } from 'react'

export function useEnsureDefaultPreset({
  queryLoading,
  record,
  create,
}: {
  queryLoading: boolean
  record: { id: string } | undefined
  create: () => Promise<unknown>
}) {
  const started = useRef(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (queryLoading) return

    if (record) {
      setSettled(true)
      return
    }

    if (started.current) return
    started.current = true

    create().finally(() => {
      setSettled(true)
    })
  }, [create, queryLoading, record])

  return {
    isReady: !queryLoading && (Boolean(record) || settled),
  }
}
