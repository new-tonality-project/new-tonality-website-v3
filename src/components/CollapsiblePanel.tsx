'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDownIcon } from './Icons'

export function CollapsiblePanel({
  title,
  children,
  className,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={clsx(className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
      >
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </span>
        <ChevronDownIcon
          className={clsx(
            'h-4 w-4 shrink-0 stroke-zinc-600 transition-transform duration-200 dark:stroke-zinc-400',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && (
        <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          {children}
        </div>
      )}
    </div>
  )
}
