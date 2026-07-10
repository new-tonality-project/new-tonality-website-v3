'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useAuth } from '@clerk/nextjs'
import { db } from '@/db'
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
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
} from 'sethares-dissonance'

const SurveyChart = dynamic(
  () => import('./SurveyChart').then((module) => module.SurveyChart),
  { ssr: false, loading: () => <div className="h-[300px] w-full rounded bg-neutral-100" /> },
)
const SurveyChartPublic = dynamic(
  () => import('./SurveyChartPublic').then((module) => module.SurveyChartPublic),
  { ssr: false, loading: () => <div className="h-[300px] w-full rounded bg-neutral-100" /> },
)

export function ExperimentCharts(props: {
  onTakeSurvey?: (open?: boolean) => void
}) {
  const [settings, setSettings] = useState<ChartSettings>({
    showAverage: false,
    showOtherParticipants: true,
    showYourResult: true,
    showExponentialFit: true,
    showPnLResults: false,
    userBackground: undefined,
    firstOrderDissonance: DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
    secondOrderDissonance: DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
    thirdOrderDissonance: DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
    phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
    xAxisStart: 0,
    xAxisEnd: 1200,
  })

  const [secondOrderEnabled, setSecondOrderEnabled] = useState(false)
  const [thirdOrderEnabled, setThirdOrderEnabled] = useState(false)

  const { isSignedIn } = useAuth()

  const effectiveSettings = useMemo(
    () => ({
      ...settings,
      showYourResult: isSignedIn ? settings.showYourResult : false,
      secondOrderDissonance: secondOrderEnabled
        ? settings.secondOrderDissonance
        : { ...settings.secondOrderDissonance, magnitude: 0 },
      thirdOrderDissonance: thirdOrderEnabled
        ? settings.thirdOrderDissonance
        : { ...settings.thirdOrderDissonance, magnitude: 0 },
    }),
    [settings, secondOrderEnabled, thirdOrderEnabled, isSignedIn]
  )

  return (
    <>
      <CollapsiblePanel title="Chart Settings" className="mb-8">
        <Fieldset>
          <div className="space-y-6 pb-6">
            <Field>
              <Label>Filter by musical background</Label>
              <Select
                value={settings.userBackground ?? ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    userBackground: parseMusicalBackground(e.target.value),
                  }))
                }
              >
                <option value="">
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
            yourResultDisabled={!isSignedIn}
            secondOrderEnabled={secondOrderEnabled}
            thirdOrderEnabled={thirdOrderEnabled}
            onSecondOrderEnabledChange={(enabled) => {
              setSecondOrderEnabled(enabled)
              if (!enabled) setThirdOrderEnabled(false)
            }}
            onThirdOrderEnabledChange={setThirdOrderEnabled}
          />
        </Fieldset>
      </CollapsiblePanel>
      <db.SignedOut>
        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[0].frequency}
          title={`${EXPERIMENTS[0].title} (${EXPERIMENTS[0].frequency}Hz)`}
          settings={effectiveSettings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[1].frequency}
          title={`${EXPERIMENTS[1].title} (${EXPERIMENTS[1].frequency}Hz)`}
          settings={effectiveSettings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[2].frequency}
          title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
          settings={effectiveSettings}
        />
      </db.SignedOut>

      <db.SignedIn>
        <SurveyChart
          meanFrequency={EXPERIMENTS[0].frequency}
          title={`${EXPERIMENTS[0].title} (${EXPERIMENTS[0].frequency}Hz)`}
          settings={effectiveSettings}
          onTakeSurvey={props.onTakeSurvey}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[1].frequency}
          title={`${EXPERIMENTS[1].title} (${EXPERIMENTS[1].frequency}Hz)`}
          settings={effectiveSettings}
          onTakeSurvey={props.onTakeSurvey}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[2].frequency}
          title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
          settings={effectiveSettings}
          onTakeSurvey={props.onTakeSurvey}
        />
      </db.SignedIn>
    </>
  )
}

