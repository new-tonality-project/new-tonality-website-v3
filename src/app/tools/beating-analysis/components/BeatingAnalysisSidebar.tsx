'use client'

import { CloseIcon } from '@/components'
import { BeatingControls } from './BeatingControls'

export function BeatingAnalysisSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-900 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Chart settings
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close settings"
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="overflow-y-auto px-6 py-6">
        <BeatingControls />
      </div>
    </aside>
  )
}
