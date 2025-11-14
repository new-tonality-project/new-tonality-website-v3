import { Strong, Text } from '@/components/catalyst/text'
import clsx from 'clsx'

export function VerticalDivider({ className }: { className?: string }) {
  return <div className={clsx('border-l border-zinc-200 p-1', className)} />
}

export function Step({
  children,
  disabled,
  number,
  title,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  number: number
  title: string
  className?: string
}) {
  return (
    <div
      className={clsx(
        'flex w-full flex-col gap-4 lg:flex-row lg:items-stretch',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <div className="lg:min-w-22">
        <Text className="whitespace-nowrap w-full text-center lg:text-center">
          <Strong>{title} {number}.</Strong>
        </Text>
      </div>
      <VerticalDivider className="hidden lg:block" />
      <div className="flex-grow pb-2 lg:pb-2">{children}</div>
    </div>
  )
}
