import { twMerge } from 'tailwind-merge'

export function Divider({
  soft = false,
  className,
  ...props
}: { soft?: boolean } & React.ComponentPropsWithoutRef<'hr'>) {
  return (
    <hr
      role="presentation"
      {...props}
      className={twMerge(
        className,
        'w-full border-t',
        soft && 'border-zinc-950/5 dark:border-white/5',
        !soft && 'border-zinc-950/10 dark:border-white/10'
      )}
    />
  )
}
