import { Subheading } from '@/components/catalyst/heading'
import { Button } from '@/components'
import { type ReactNode } from 'react'
import type { PlotBounds } from './DissonanceChartOverlay'

export function ChartHeader({
  title,
  onTakeSurvey,
  button,
  plotBounds,
}: {
  title: string
  onTakeSurvey?: () => void
  button?: ReactNode
  plotBounds: PlotBounds | null
}) {
  if (!plotBounds) return null

  return (
    <div
      className="pointer-events-none absolute z-20 flex items-center gap-2 rounded-md bg-white/85 px-2 py-0.5 dark:bg-zinc-950/85"
      style={{
        top: plotBounds.top + 8,
        left: plotBounds.left + plotBounds.width - 8,
        transform: 'translateX(-100%)',
      }}
    >
      <Subheading className="m-0 whitespace-nowrap">{title}</Subheading>
      {(button || onTakeSurvey) && (
        <div className="pointer-events-auto">
          {button || (
            <Button onClick={onTakeSurvey} variant="primary" className="px-2 py-1! text-xs">
              Take survey
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
