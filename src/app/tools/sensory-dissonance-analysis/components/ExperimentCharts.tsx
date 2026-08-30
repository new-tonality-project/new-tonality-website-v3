'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { DissonanceParamsProvider, useDissonanceParams } from '@/components/DissonanceParamsProvider'
import { EXPERIMENTS } from '../utils'
import type { ChartSettings } from './types'
import { ChartDataControls } from './ChartDataControls'
import { DissonanceSettingsSidebar } from './DissonanceSettingsSidebar'
import {
  SensoryDissonanceAnalysisProvider,
  useSensoryDissonanceAnalysisSettings,
} from './SensoryDissonanceAnalysisProvider'

const SurveyChart = dynamic(
  () => import('./SurveyChart').then((module) => module.SurveyChart),
  { ssr: false, loading: () => <div className="h-[232px] w-full rounded bg-neutral-100" /> },
)
const SurveyChartPublic = dynamic(
  () => import('./SurveyChartPublic').then((module) => module.SurveyChartPublic),
  { ssr: false, loading: () => <div className="h-[232px] w-full rounded bg-neutral-100" /> },
)

function ExperimentChartsContent(props: {
  onTakeSurvey?: (open?: boolean) => void
}) {
  const [dissonanceSettingsOpen, setDissonanceSettingsOpen] = useState(false)
  const { settings, update } = useSensoryDissonanceAnalysisSettings()
  const { settings: dissonanceParams, update: updateDissonanceParams } =
    useDissonanceParams()
  const user = db.useUser()
  const isAuthenticatedUser = !user.isGuest

  const effectiveSettings = useMemo(
    (): ChartSettings => ({
      ...settings,
      ...dissonanceParams,
      showYourResult: isAuthenticatedUser ? settings.showYourResult : false,
    }),
    [settings, dissonanceParams, isAuthenticatedUser],
  )

  return (
    <>
      <DissonanceSettingsSidebar
        open={dissonanceSettingsOpen}
        onClose={() => setDissonanceSettingsOpen(false)}
        value={dissonanceParams}
        onChange={updateDissonanceParams}
      />

      <div className="mb-4">
        <ChartDataControls
          value={settings}
          onChange={update}
          yourResultDisabled={!isAuthenticatedUser}
          dissonanceSettingsOpen={dissonanceSettingsOpen}
          onToggleDissonanceSettings={() =>
            setDissonanceSettingsOpen((open) => !open)
          }
        />
      </div>

      {!isAuthenticatedUser ? (
        <div className="w-full overflow-x-auto overflow-y-visible lg:overflow-x-visible mt-2">
          <div className="min-w-150 overflow-visible lg:min-w-0">
            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[0].frequency}
              title={`${EXPERIMENTS[0].title} (${EXPERIMENTS[0].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideXAxis
              hideYAxisTitles
            />

            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[1].frequency}
              title={`${EXPERIMENTS[1].title} (${EXPERIMENTS[1].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideXAxis
              plotBorderTop
              plotBorderBottom
            />

            <SurveyChartPublic
              meanFrequency={EXPERIMENTS[2].frequency}
              title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
              settings={effectiveSettings}
              hideLegend
              hideYAxisTitles
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
            />

            <SurveyChart
              meanFrequency={EXPERIMENTS[2].frequency}
              title={`${EXPERIMENTS[2].title} (${EXPERIMENTS[2].frequency}Hz)`}
              settings={effectiveSettings}
              onTakeSurvey={props.onTakeSurvey}
              hideLegend
              hideYAxisTitles
            />
          </div>
        </div>
      )}
    </>
  )
}

export function ExperimentCharts(props: {
  onTakeSurvey?: (open?: boolean) => void
}) {
  return (
    <>
      <db.SignedOut>
        <div className="mb-4 h-24 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
        <div className="mt-2 h-[696px] w-full rounded bg-neutral-100 dark:bg-neutral-800" />
      </db.SignedOut>
      <db.SignedIn>
        <DissonanceParamsProvider>
          <SensoryDissonanceAnalysisProvider>
            <ExperimentChartsContent {...props} />
          </SensoryDissonanceAnalysisProvider>
        </DissonanceParamsProvider>
      </db.SignedIn>
    </>
  )
}
