'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { EXPERIMENTS } from '../utils'
import type { ChartSettings } from './types'
import { ChartDataControls } from './ChartDataControls'
import { DissonanceSettingsSidebar } from './DissonanceSettingsSidebar'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
} from 'sethares-dissonance'

const SurveyChart = dynamic(
  () => import('./SurveyChart').then((module) => module.SurveyChart),
  { ssr: false, loading: () => <div className="h-[232px] w-full rounded bg-neutral-100" /> },
)
const SurveyChartPublic = dynamic(
  () => import('./SurveyChartPublic').then((module) => module.SurveyChartPublic),
  { ssr: false, loading: () => <div className="h-[232px] w-full rounded bg-neutral-100" /> },
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
    secondOrderDissonance: {
      ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      magnitude: 0,
    },
    thirdOrderDissonance: {
      ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      magnitude: 0,
    },
    phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
    xAxisStart: 0,
    xAxisEnd: 1200,
  })

  const [dissonanceSettingsOpen, setDissonanceSettingsOpen] = useState(false)

  const { user, isLoading: isAuthLoading } = db.useAuth()
  const isAuthenticatedUser = Boolean(user && !user.isGuest)

  const effectiveSettings = useMemo(
    () => ({
      ...settings,
      showYourResult: isAuthenticatedUser ? settings.showYourResult : false,
    }),
    [settings, isAuthenticatedUser]
  )

  return (
    <>
      <DissonanceSettingsSidebar
        open={dissonanceSettingsOpen}
        onClose={() => setDissonanceSettingsOpen(false)}
        value={settings}
        onChange={setSettings}
      />

      <div className="mb-4">
        <ChartDataControls
          value={settings}
          onChange={setSettings}
          yourResultDisabled={!isAuthenticatedUser}
          dissonanceSettingsOpen={dissonanceSettingsOpen}
          onToggleDissonanceSettings={() =>
            setDissonanceSettingsOpen((open) => !open)
          }
        />
      </div>

      {isAuthLoading ? null : !isAuthenticatedUser ? (
        <div className="w-full overflow-x-auto overflow-y-visible lg:overflow-x-visible mt-2">
          <div className="min-w-150 overflow-visible lg:min-w-0">
            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[0].frequency}
              title={`${EXPERIMENTS[0].title} (${EXPERIMENTS[0].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideXAxis
              hideYAxisTitles
              zIndex={1}
            />

            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[1].frequency}
              title={`${EXPERIMENTS[1].title} (${EXPERIMENTS[1].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideXAxis
              plotBorderTop
              plotBorderBottom
              zIndex={2}
            />

            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[2].frequency}
              title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideYAxisTitles
              zIndex={3}
            />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto overflow-y-visible lg:overflow-x-visible mt-2">
          <div className="min-w-150 overflow-visible lg:min-w-0">
            <SurveyChart
              meanFrequency={EXPERIMENTS[0].frequency}
              title={`${EXPERIMENTS[0].title} (${EXPERIMENTS[0].frequency}Hz)`}
              settings={effectiveSettings}
              onTakeSurvey={props.onTakeSurvey}
              hideLegend
              hideXAxis
              hideYAxisTitles
              zIndex={1}
            />

            <SurveyChart
              meanFrequency={EXPERIMENTS[1].frequency}
              title={`${EXPERIMENTS[1].title} (${EXPERIMENTS[1].frequency}Hz)`}
              settings={effectiveSettings}
              onTakeSurvey={props.onTakeSurvey}
              hideLegend
              hideXAxis
              plotBorderTop
              plotBorderBottom
              zIndex={2}
            />

            <SurveyChart
              meanFrequency={EXPERIMENTS[2].frequency}
              title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
              settings={effectiveSettings}
              onTakeSurvey={props.onTakeSurvey}
              hideLegend
              hideYAxisTitles
              zIndex={3}
            />
          </div>
        </div>
      )}
    </>
  )
}
