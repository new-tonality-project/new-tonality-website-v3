'use client'

import type { ReactNode } from 'react'
import { CloseIcon } from '@/components'
import { DissonanceParams } from './DissonanceParams'
import { SpectrumParams } from './SpectrumParams'

function ParamsDrawer({
  open,
  onClose,
  side,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  side: 'left' | 'right'
  title: string
  children: ReactNode
}) {
  const isLeft = side === 'left'

  return (
    <aside
      className={`fixed inset-y-0 z-sidebar flex w-72 flex-col bg-white transition-transform duration-200 dark:bg-zinc-900 ${
        isLeft
          ? 'left-0 border-r border-zinc-200 dark:border-zinc-800'
          : 'right-0 border-l border-zinc-200 dark:border-zinc-800'
      } ${
        open
          ? 'translate-x-0'
          : isLeft
            ? '-translate-x-full'
            : 'translate-x-full'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title.toLowerCase()}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        {children}
      </div>
    </aside>
  )
}

export function DissonanceParamsSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <ParamsDrawer
      open={open}
      onClose={onClose}
      side="left"
      title="Dissonance settings"
    >
      <DissonanceParams />
    </ParamsDrawer>
  )
}

export function SpectrumParamsSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <ParamsDrawer
      open={open}
      onClose={onClose}
      side="right"
      title="Spectrum settings"
    >
      <SpectrumParams />
    </ParamsDrawer>
  )
}
