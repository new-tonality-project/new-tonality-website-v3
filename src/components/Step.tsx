import { Strong, Text } from '@/components/catalyst/text'
import clsx from 'clsx'

export function VerticalDivider() {
  return <div className="border-l border-zinc-200 p-1" />
}

export function Step({
  children,
  disabled,
  number,
}: {
  children: React.ReactNode
  disabled?: boolean
  number: number
}) {
  return (
    <div
      className={clsx(
        'mb-4 flex w-full items-stretch gap-2',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <div className="w-fit min-w-12 flex-grow-0">
        <Text className="whitespace-nowrap">
          <Strong>Step {number}.</Strong>
        </Text>
      </div>
      <VerticalDivider />
      <div className="flex-grow">{children}</div>
    </div>
  )
}
