'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'

type TooltipProps = {
  content: React.ReactNode
  className?: string
}

export function Tooltip({ content, className }: TooltipProps) {
  return (
    <Headless.Popover className="relative">
      <Headless.PopoverButton
        className={clsx(
          className,
          'mb-1 inline-flex cursor-pointer items-center justify-center rounded-full border align-baseline text-xs opacity-50 hover:opacity-100',
          'h-4 w-4 sm:h-4 sm:w-4',
          'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-hidden',
          'transition-colors',
        )}
        aria-label="Show tooltip"
      >
        ?
      </Headless.PopoverButton>

      <Headless.PopoverPanel
        transition
        anchor="top"
        className={clsx(
          '[--anchor-gap:--spacing(2)] [--anchor-padding:--spacing(1)]',
          'isolate w-max max-w-sm rounded-lg p-3',
          'outline outline-transparent focus:outline-hidden',
          'bg-white/90 backdrop-blur-sm dark:bg-zinc-800/90',
          'shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10',
          'transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:scale-95 data-closed:data-leave:opacity-0',
          'text-sm text-zinc-950 dark:text-white',
        )}
      >
        {content}
      </Headless.PopoverPanel>
    </Headless.Popover>
  )
}
