import type { ReactNode } from 'react'

export function SidebarSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="border-b border-zinc-200 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
