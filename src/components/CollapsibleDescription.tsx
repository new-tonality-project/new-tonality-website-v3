'use client'

import { useState } from 'react'
import clsx from 'clsx'

export function CollapsibleDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={clsx(className)}>
      <div className={`relative overflow-hidden`}>
        <div className={isExpanded ? '' : 'line-clamp-3'}>{children}</div>
        <div
          className={`pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-white to-transparent transition-opacity duration-300 dark:from-zinc-900 ${
            isExpanded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
      <div className="relative mt-2 flex justify-center">
        <div
          className={`absolute top-0 right-0 left-0 h-px bg-zinc-200 dark:bg-zinc-700`}
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer rounded-b-md border-x border-t-0 border-b border-zinc-200 px-4 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      </div>
    </div>
  )
}

