import { Strong, Text } from '@/components/catalyst/text'
import clsx from 'clsx'

export function VerticalDivider() {
  return <div className="border-l border-zinc-200 p-1" />
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
        'flex w-full items-stretch gap-4',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <div className="min-w-22">
        <Text className="whitespace-nowrap w-full text-center">
          <Strong>{title} {number}.</Strong>
        </Text>
      </div>
      <VerticalDivider />
      <div className="flex-grow pb-2">{children}</div>
    </div>
  )
}
