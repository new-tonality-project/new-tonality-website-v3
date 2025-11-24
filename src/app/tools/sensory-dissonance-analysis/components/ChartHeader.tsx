import { Subheading } from '@/components/catalyst/heading'
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
    <div className="flex w-full flex-wrap items-center gap-4 justify-start absolute top-2 pl-14">
      <Subheading className='m-0'>{title}</Subheading>
      {button || (onTakeSurvey && (
        <Button onClick={onTakeSurvey} variant="primary" className="text-xs py-1! px-2">Start experiment</Button>
      ))}
    </div>
  )
}

