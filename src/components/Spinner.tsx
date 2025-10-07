import clsx from 'clsx'

export function Spinner(props: { className?: string }) {
  return (
    <div
      className={clsx(
        'h-10 w-10 animate-spin rounded-full border-4 border-t-zinc-900 border-r-zinc-200 border-b-zinc-200 border-l-zinc-200',
        props.className,
      )}
    />
  )
}
