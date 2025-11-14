import { Heading } from '@/components/catalyst/heading'
import { Button } from '@/components'
import { type ReactNode } from 'react'

export function ChartHeader({ 
  title, 
  onTakeSurvey,
  button 
}: { 
  title: string
  onTakeSurvey?: () => void
  button?: ReactNode
}) {
  return (
    <div className="flex w-full flex-wrap items-center gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
      <Heading>{title}</Heading>
      {button || (onTakeSurvey && (
        <Button onClick={onTakeSurvey} variant="secondary">Discover your curve</Button>
      ))}
    </div>
  )
}

