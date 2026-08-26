'use client'

import Image, { type StaticImageData } from 'next/image'
import { type ReactNode } from 'react'
import { DragNumberInput, SettingsIcon } from '@/components'
import { Button } from '@/components/catalyst/button'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'
import { MusicalBackground } from '@/lib/types'
import { parseMusicalBackground } from '@/lib'
import otherParticipantsIcon from '@/images/tools/other-participants.png'
import myResultIcon from '@/images/tools/my-result.png'
import theoryFitIcon from '@/images/tools/theory-fit.png'
import pnlIcon from '@/images/tools/pnl.png'
import type { ChartSettings } from './types'

type ChartDataControlsProps = {
  value: ChartSettings
  onChange: (params: ChartSettings) => void
  yourResultDisabled?: boolean
  dissonanceSettingsOpen: boolean
  onToggleDissonanceSettings: () => void
}

function SeriesLabel({
  icon,
  children,
}: {
  icon: StaticImageData
  children: ReactNode
}) {
  return (
    <Label className="inline-flex items-center gap-2 text-sm font-normal">
      {children}
      <Image
        src={icon}
        alt=""
        width={20}
        height={20}
        className="size-5 shrink-0 object-contain"
        aria-hidden
      />
    </Label>
  )
}

export function ChartDataControls({
  value,
  onChange,
  yourResultDisabled = false,
  dissonanceSettingsOpen,
  onToggleDissonanceSettings,
}: ChartDataControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-52 shrink-0">
          <Select
            value={value.userBackground ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                userBackground: parseMusicalBackground(e.target.value),
              })
            }
            aria-label="Musical background"
          >
            <option value="">All participants</option>
            <option value={MusicalBackground.NaiveListener}>
              No musical background
            </option>
            <option value={MusicalBackground.Musician}>Musicians only</option>
            <option value={MusicalBackground.Microtonalist}>
              Microtonalists only
            </option>
          </Select>
        </div>

        <DragNumberInput
          variant="outlined"
          defaultValue={0}
          value={value.xAxisStart}
          min={0}
          max={Math.max(0, value.xAxisEnd - 1)}
          minStep={1}
          valueRange={1000}
          whole
          label="Start (cents)"
          onChange={(xAxisStart) => onChange({ ...value, xAxisStart })}
        />
        <DragNumberInput
          variant="outlined"
          defaultValue={1200}
          value={value.xAxisEnd}
          min={Math.min(1200, value.xAxisStart + 1)}
          max={3600}
          minStep={1}
          valueRange={1000}
          whole
          label="End (cents)"
          onChange={(xAxisEnd) => onChange({ ...value, xAxisEnd })}
        />

        <Button
          type="button"
          className='flex items-center gap-x-2 cursor-pointer'
          plain
          onClick={onToggleDissonanceSettings}
          aria-pressed={dissonanceSettingsOpen}
        >
          Dissonance settings
          <SettingsIcon className='size-4' />
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <CheckboxField className='gap-x-2!'>
          <Checkbox
            checked={value.showOtherParticipants}
            onChange={(checked) =>
              onChange({
                ...value,
                showOtherParticipants: checked,
              })
            }
          />
          <SeriesLabel icon={otherParticipantsIcon}>
            Other participants
          </SeriesLabel>
        </CheckboxField>

        <CheckboxField className='gap-x-2!'>
          <Checkbox
            checked={yourResultDisabled ? false : value.showYourResult}
            disabled={yourResultDisabled}
            onChange={(checked) =>
              onChange({
                ...value,
                showYourResult: checked,
              })
            }
          />
          <SeriesLabel icon={myResultIcon}>Your result</SeriesLabel>
        </CheckboxField>

        <CheckboxField className='gap-x-2!'>
          <Checkbox
            checked={value.showExponentialFit}
            onChange={(checked) =>
              onChange({
                ...value,
                showExponentialFit: checked,
              })
            }
          />
          <SeriesLabel icon={theoryFitIcon}>Theoretical fit</SeriesLabel>
        </CheckboxField>

        <CheckboxField className='gap-x-2!'>
          <Checkbox
            checked={value.showPnLResults}
            onChange={(checked) =>
              onChange({
                ...value,
                showPnLResults: checked,
              })
            }
          />
          <SeriesLabel icon={pnlIcon}>P&amp;L results</SeriesLabel>
        </CheckboxField>
      </div>
    </div>
  )
}
