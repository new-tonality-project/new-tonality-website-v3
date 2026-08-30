'use client'

import { CloseIcon } from '@/components'
import { DissonanceCurveControls } from '@/components/DissonanceCurveControls'
import type { ChartSettings } from './types'

export function DissonanceSettingsSidebar({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean
  onClose: () => void
  value: ChartSettings
  onChange: (params: ChartSettings) => void
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-sidebar flex w-72 m-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-sm m-0 font-semibold text-zinc-900 dark:text-zinc-100">
          Dissonance settings
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dissonance settings"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        <DissonanceCurveControls value={value} onChange={onChange} />
      </div>
    </aside>
  )
}
