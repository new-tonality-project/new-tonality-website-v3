'use client'

import { DragNumberInput } from '@/components'
import { DEFAULT_BEATING_ANALYSIS_STATE } from './useSyncBeatingAnalysisSettings'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

export function AudioControls() {
  const { settings, update } = useBeatingAnalysisSettings()

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <DragNumberInput
        variant="mini"
        className="ml-0"
        defaultValue={DEFAULT_BEATING_ANALYSIS_STATE.volume}
        value={settings.volume}
        min={0}
        max={100}
        minStep={1}
        valueRange={100}
        whole
        label="Volume"
        onChange={(volume) => update({ volume })}
      />
      <p className="m-0 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
        To play sounds, press and hold <Kbd>R</Kbd> for the reference
        tone, <Kbd>I</Kbd> for the interval tone, and <Kbd>P</Kbd> for both.
      </p>
    </div>
  )
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-zinc-300 px-1 py-px font-sans text-[10px] dark:border-zinc-600">
      {children}
    </kbd>
  )
}
