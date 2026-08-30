'use client'

export function AudioControls() {
  return (
    <p className="mb-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
      To play sounds, press and hold <Kbd>R</Kbd> for the reference
      tone, <Kbd>I</Kbd> for the interval tone, and <Kbd>P</Kbd> for both.
    </p>
  )
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-zinc-300 px-1 py-px font-sans text-[10px] dark:border-zinc-600">
      {children}
    </kbd>
  )
}
