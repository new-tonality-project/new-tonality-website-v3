import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export function SidebarSection({
  className,
  classNameContent,
  title,
  children,
}: {
  className?: string
  classNameContent?: string
  title: string
  children: ReactNode
}) {
  return (
    <section className={twMerge("flex flex-col gap-3", className)}>
      <h3 className="border-b border-zinc-200 pb-2 m-0 text-xs text-zinc-500">
        {title}
      </h3>
      <div className={twMerge("flex flex-col gap-3", classNameContent)}>{children}</div>
    </section>
  )
}
