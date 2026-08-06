'use client'

import { useMemo, useState } from 'react'
import { Chart } from '@highcharts/react'
import type Highcharts from 'highcharts'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { COLORS } from '@/lib/colors'
import { roundToDecimals } from '@/lib/utils'
import { Label } from '@headlessui/react'
import {
  computePeakEnvelope,
  computeRmsEnvelope,
  DEFAULT_PERIODS,
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REFERENCE_FREQUENCY,
  ENVELOPE_WINDOW_PERIODS,
  generateWaveforms,
  getReferencePeriodGridTicks,
} from '../utils'

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
}: {
  title: string
  data: [number, number][]
  color: string
  durationMs: number
  periodGridTicks: number[]
  showXAxis?: boolean
  showYAxisTitle?: boolean
  overlaySeries?: OverlaySeries[]
}) {
  const options = useMemo(
    (): Highcharts.Options =>
      ({
        ...baseChartOptions,
        chart: {
          ...baseChartOptions.chart,
          height: showXAxis ? 160 : 130,
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
    [title, data, color, durationMs, periodGridTicks, showXAxis, showYAxisTitle, overlaySeries],
  )

  return (
    // @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props
    <Chart options={options} />
  )
}

export function BeatingCharts() {
  const [referenceFrequency, setReferenceFrequency] = useState(DEFAULT_REFERENCE_FREQUENCY)
  const [periods, setPeriods] = useState(DEFAULT_PERIODS)
  const [intervalCents, setIntervalCents] = useState(702)
  const [amplitude, setAmplitude] = useState(1)
  const [phaseDegrees, setPhaseDegrees] = useState(DEFAULT_PHASE_DEGREES)
  const [showEnvelope, setShowEnvelope] = useState(true)
  const [showRms, setShowRms] = useState(false)

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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2" >
        <div className="flex flex-wrap items-center gap-2">

          <DragNumberInput
            defaultValue={10}
            value={intervalCents}
            min={0}
            max={4800}
            minStep={1}
            valueRange={100}
            label="Interval (cents)"
            onChange={setIntervalCents}
          />
          <DragNumberInput
            defaultValue={1}
            value={amplitude}
            min={0}
            max={2}
            minStep={0.01}
            valueRange={1}
            label="Amplitude"
            onChange={setAmplitude}
          />
          <DragNumberInput
            defaultValue={DEFAULT_PHASE_DEGREES}
            value={phaseDegrees}
            min={-360}
            max={360}
            minStep={1}
            valueRange={360}
            whole
            label="Phase (°)"
            onChange={setPhaseDegrees}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <DragNumberInput
            defaultValue={DEFAULT_REFERENCE_FREQUENCY}
            value={referenceFrequency}
            min={20}
            max={2000}
            minStep={1}
            valueRange={200}
            whole
            label="Reference (Hz)"
            onChange={setReferenceFrequency}
          />
          <DragNumberInput
            defaultValue={DEFAULT_PERIODS}
            value={periods}
            min={1}
            max={1000}
            minStep={1}
            valueRange={100}
            whole
            label="Periods"
            onChange={setPeriods}
          />
          <CheckboxField className="ml-4">
            <Checkbox checked={showEnvelope} onChange={setShowEnvelope} />
            <Label className="text-sm">Show envelope</Label>
          </CheckboxField>
          <CheckboxField>
            <Checkbox checked={showRms} onChange={setShowRms} />
            <Label className="text-sm">Show RMS</Label>
          </CheckboxField>
        </div>
      </div>

      <div className="flex flex-col md:-ml-7">
        <WaveformChart
          title={`Reference tone (${referenceFrequency} Hz)`}
          data={waveforms.reference}
          color={COLORS.blue}
          durationMs={waveforms.durationMs}
          periodGridTicks={periodGridTicks}
        />
        <WaveformChart
          title={`Interval tone (${waveforms.intervalFrequency.toFixed(2)} Hz)`}
          data={waveforms.intervalTone}
          color={COLORS.orange}
          durationMs={waveforms.durationMs}
          periodGridTicks={periodGridTicks}
          showYAxisTitle
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
    </div>
  )
}
