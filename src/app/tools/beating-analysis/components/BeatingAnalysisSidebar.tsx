'use client'

import { useState } from 'react'
import { CloseIcon } from '@/components'
import { Select } from '@/components/Select'
import { DissonanceParams } from './DissonanceParams'
import { GeneralParams } from './GeneralParams'
import { SpectrumParams } from './SpectrumParams'

type ParamsPanel = 'general' | 'spectrum' | 'dissonance'

const paramsPanelItems: { value: ParamsPanel; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'spectrum', label: 'Spectrum' },
  { value: 'dissonance', label: 'Dissonance' },
]

function ParamsPanelContent({ panel }: { panel: ParamsPanel }) {
  switch (panel) {
    case 'general':
      return <GeneralParams />
    case 'spectrum':
      return <SpectrumParams />
    case 'dissonance':
      return <DissonanceParams />
  }
}

export function BeatingAnalysisSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [paramsPanel, setParamsPanel] = useState<ParamsPanel>('general')

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-sidebar flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Parameters
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close parameters"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        <Select
          items={paramsPanelItems}
          value={paramsPanel}
          onSelect={setParamsPanel}
          className="mb-6 shrink-0"
        />
        <div className="flex-1">
          <ParamsPanelContent panel={paramsPanel} />
        </div>
      </div>
    </aside>
  )
}
