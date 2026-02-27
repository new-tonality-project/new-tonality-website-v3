'use client'

import { useState } from 'react'
import { db } from '@/db'
import { SurveyChart, SurveyChartPublic } from './'
import { EXPERIMENTS } from '../utils'
import { MusicalBackground } from '@/lib/types'
import type { ChartSettings } from './types'
import {
  Fieldset,
  Field,
  Label,
} from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'
import { CollapsiblePanel } from '@/components'
import { parseMusicalBackground } from '@/lib'
import { DissonanceCurveControls } from './DissonanceCurveControls'
import { SETHARES_DISSONANCE_PARAMS } from 'sethares-dissonance'

export function ExperimentCharts() {
  const [settings, setSettings] = useState<ChartSettings>({
    showAverage: false,
    showExponentialFit: true,
    userBackground: undefined,
    firstOrderContribution: 1,
    secondOrderContribution: 0,
    thirdOrderContribution: 0,
    phantomHarmonicsNumber: 0,
    start: 1,
    end: 2,
    ...SETHARES_DISSONANCE_PARAMS,
  })

  return (
    <>
      <CollapsiblePanel title="Chart Settings" className="mb-8">
        <Fieldset>
          <div className="space-y-6 pb-6">
            <Field>
              <Label>Filter by musical background</Label>
              <Select
                value={settings.userBackground?.toString()}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    userBackground: parseMusicalBackground(e.target.value),
                  }))
                }
              >
                <option value={undefined}>
                  All participants
                </option>
                <option value={MusicalBackground.NaiveListener}>
                  No musical background
                </option>
                <option value={MusicalBackground.Musician}>
                  Musicians only
                </option>
                <option value={MusicalBackground.Microtonalist}>
                  Microtonalists only
                </option>
              </Select>
            </Field>
          </div>
          <DissonanceCurveControls
            value={settings}
            onChange={setSettings}
          />
        </Fieldset>
      </CollapsiblePanel>
      <db.SignedOut>
        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[0].frequency}
          title={EXPERIMENTS[0].title}
          settings={settings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[1].frequency}
          title={EXPERIMENTS[1].title}
          settings={settings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[2].frequency}
          title={EXPERIMENTS[2].title}
          settings={settings}
        />
      </db.SignedOut>

      <db.SignedIn>
        <SurveyChart
          meanFrequency={EXPERIMENTS[0].frequency}
          title={EXPERIMENTS[0].title}
          settings={settings}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[1].frequency}
          title={EXPERIMENTS[1].title}
          settings={settings}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[2].frequency}
          title={EXPERIMENTS[2].title}
          settings={settings}
        />
      </db.SignedIn>
    </>
  )
}

