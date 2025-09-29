'use client'

import type { SetharesDissonancePreset } from '@/db'
import { useState } from 'react'
import { updatePreset } from './utils'

export function usePreset(initialPreset: SetharesDissonancePreset) {
  const [state, setState] = useState(initialPreset)

  function setNumberOfPartials(numberOfPartials: number) {
    setState((curr) => ({ ...curr, numberOfPartials }))

    if (state.id && state.userId) {
      updatePreset(state.id, numberOfPartials)
    }
  }

  return {
    ...state,
    setNumberOfPartials,
  }
}


