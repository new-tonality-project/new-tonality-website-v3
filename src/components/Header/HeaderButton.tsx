import clsx from 'clsx'
import Link from 'next/link'

const variantStyles = {
  primary:
    'group rounded-full bg-zinc-900 hover:bg-zinc-700 px-4 py-2 text-sm text-zinc-100 hover shadow-lg ring-1 shadow-zinc-800/5 ring-white-900/5 backdrop-blur-sm transition dark:bg-white-800/90 dark:ring-white/10 dark:hover:ring-white/20',
  secondary:
    'group rounded-full bg-zinc-0 hover:bg-zinc-100 px-4 py-2 text-sm text-zinc-900 shadow-lg ring-1 shadow-zinc-800/5 ring-zinc-900/5 backdrop-blur-sm transition dark:bg-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20',
}

type HeaderButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function HeaderButton({
  variant = 'primary',
  className,
  ...props
}: HeaderButtonProps) {
  className = clsx(variantStyles[variant], className)

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
