'use client'

import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import type Highcharts from 'highcharts'
import { SettingsIcon } from '@/components'
import { COLORS } from '@/lib/colors'
import { roundToDecimals } from '@/lib/utils'
import {
  computePeakEnvelope,
  computeRmsEnvelope,
  ENVELOPE_WINDOW_PERIODS,
  generateWaveforms,
  getReferencePeriodGridTicks,
} from '../utils'
import { useBeatingAnalysisSettings } from './BeatingAnalysisProvider'

const baseChartOptions: Highcharts.Options = {
  chart: {
    height: 140,
    backgroundColor: 'transparent',
    animation: false,
    marginLeft: 50,
    marginRight: 20,
    spacingTop: 0,
    spacingBottom: 0,
  },
  credits: { enabled: false },
  legend: { enabled: false },
  tooltip: { enabled: false },
  xAxis: {
    gridLineColor: '#ddd',
    gridLineDashStyle: 'Dash',
    gridLineWidth: 1,
  },
  yAxis: {
    title: { text: 'Amplitude' },
    min: -2.2,
    max: 2.2,
    tickInterval: 1,
    gridLineColor: '#ddd',
    gridLineDashStyle: 'Dash',
    gridLineWidth: 1,
  },
  plotOptions: {
    line: {
      animation: false,
      enableMouseTracking: false,
      marker: { enabled: false },
      lineWidth: 1.5,
      states: {
        hover: {
          enabled: false,
          lineWidthPlus: 0,
        },
        inactive: {
          enabled: false,
        },
      },
    },
  },
}

type OverlaySeries = {
  data: [number, number][]
  color: string
  lineWidth?: number
}

function WaveformChart({
  title,
  data,
  color,
  durationMs,
  periodGridTicks,
  showXAxis = false,
  showYAxisTitle = false,
  overlaySeries = [],
  height,
  yAxisMin,
  yAxisMax,
}: {
  title: string
  data: [number, number][]
  color: string
  durationMs: number
  periodGridTicks: number[]
  showXAxis?: boolean
  showYAxisTitle?: boolean
  overlaySeries?: OverlaySeries[]
  height?: number
  yAxisMin?: number
  yAxisMax?: number
}) {
  const chartHeight = height ?? (showXAxis ? 160 : 130)

  const options = useMemo(
    (): Highcharts.Options =>
      ({
        ...baseChartOptions,
        chart: {
          ...baseChartOptions.chart,
          height: chartHeight,
          marginBottom: showXAxis ? 56 : 8,
        },
        title: {
          text: title,
          align: 'right',
          margin: 0,
          style: { fontSize: '14px', fontWeight: '600' },
        },
        xAxis: {
          ...baseChartOptions.xAxis,
          min: 0,
          max: durationMs,
          tickPositions: periodGridTicks,
          labels: {
            enabled: showXAxis,
            formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
              return String(roundToDecimals(this.value as number))
            },
          },
          title: showXAxis ? { text: 'Time (ms)', margin: 0 } : undefined,
          lineWidth: showXAxis ? 1 : 0,
          tickLength: showXAxis ? 5 : 0,
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          min: yAxisMin ?? -2.2,
          max: yAxisMax ?? 2.2,
          title: showYAxisTitle ? { text: 'Amplitude' } : undefined,
        },
        series: [
          {
            type: 'line',
            data,
            color,
          },
          ...overlaySeries.map((series) => ({
            type: 'line' as const,
            data: series.data,
            color: series.color,
            lineWidth: series.lineWidth ?? 1,
          })),
        ],
      }) as Highcharts.Options,
    [title, data, color, durationMs, periodGridTicks, showXAxis, showYAxisTitle, overlaySeries, chartHeight, yAxisMin, yAxisMax],
  )

  return (
    // @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props
    <Chart options={options} />
  )
}

export function BeatingCharts({
  sidebarOpen,
  onToggleSidebar,
}: {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}) {
  const { settings } = useBeatingAnalysisSettings()
  const {
    referenceFrequency,
    periods,
    intervalCents,
    amplitude,
    phaseDegrees,
    showEnvelope,
    showRms,
  } = settings
  const waveforms = useMemo(
    () =>
      generateWaveforms({
        referenceFrequency,
        periods,
        intervalCents,
        amplitude,
        phaseDegrees,
      }),
    [referenceFrequency, periods, intervalCents, amplitude, phaseDegrees],
  )

  const sumEnvelope = useMemo(
    () =>
      computePeakEnvelope(
        waveforms.sum,
        waveforms.samplesPerReferencePeriod,
        ENVELOPE_WINDOW_PERIODS,
      ),
    [waveforms.sum, waveforms.samplesPerReferencePeriod],
  )

  const sumRms = useMemo(
    () =>
      computeRmsEnvelope(
        waveforms.sum,
        waveforms.samplesPerReferencePeriod,
        ENVELOPE_WINDOW_PERIODS,
      ),
    [waveforms.sum, waveforms.samplesPerReferencePeriod],
  )

  const periodGridTicks = useMemo(
    () => getReferencePeriodGridTicks(periods, waveforms.durationMs),
    [periods, waveforms.durationMs],
  )

  const sumOverlaySeries = useMemo((): OverlaySeries[] => {
    const series: OverlaySeries[] = []

    if (showEnvelope) {
      series.push(
        {
          data: sumEnvelope.upper,
          color: COLORS.black,
        },
        {
          data: sumEnvelope.lower,
          color: COLORS.black,
        },
      )
    }

    if (showRms) {
      series.push({
        data: sumRms,
        color: COLORS.pink,
        lineWidth: 2.5,
      })
    }

    return series
  }, [showEnvelope, showRms, sumEnvelope, sumRms])

  return (
    <div className="relative flex flex-col md:-ml-7">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Close settings' : 'Open settings'}
        aria-pressed={sidebarOpen}
        className="absolute top-1 -left-4 z-10 flex size-9 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <SettingsIcon className="size-4" />
      </button>

      <WaveformChart
        title={`Reference tone (${referenceFrequency} Hz)`}
        data={waveforms.reference}
        color={COLORS.blue}
        durationMs={waveforms.durationMs}
        periodGridTicks={periodGridTicks}
        height={75}
        yAxisMin={-2}
        yAxisMax={2}
      />
      <WaveformChart
        title={`Interval tone (${waveforms.intervalFrequency.toFixed(2)} Hz)`}
        data={waveforms.intervalTone}
        color={COLORS.orange}
        durationMs={waveforms.durationMs}
        periodGridTicks={periodGridTicks}
        showYAxisTitle
        height={75}
        yAxisMin={-2}
        yAxisMax={2}
      />
      <WaveformChart
        title="Sum"
        data={waveforms.sum}
        color={COLORS.green}
        durationMs={waveforms.durationMs}
        periodGridTicks={periodGridTicks}
        showXAxis
        overlaySeries={sumOverlaySeries}
      />
    </div>
  )
}
