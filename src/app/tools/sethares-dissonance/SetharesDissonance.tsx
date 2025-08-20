'use client'

import { SetharesDissonancePreset } from '@/db'
import { usePreset } from './usePreset'
import { FALLBACK_PRESET } from './utils'

type SetharesDissonanceProps = {
  initialPreset?: SetharesDissonancePreset
}

export function SetharesDissonance(props: SetharesDissonanceProps) {
  const { numberOfPartials, setNumberOfPartials } = usePreset(
    props.initialPreset || FALLBACK_PRESET,
  )

  return (
    <div className="flex max-w-50 flex-col">
      <label htmlFor="numberOfPartials" className="text-xs">
        {' '}
        Number of partials: {numberOfPartials}
      </label>
      <input
        name="numberOfPartials"
        min={1}
        max={100}
        type="range"
        value={numberOfPartials}
        onChange={(e) => {
          setNumberOfPartials(parseInt(e.target.value))
        }}
      />
    </div>
  )
}
