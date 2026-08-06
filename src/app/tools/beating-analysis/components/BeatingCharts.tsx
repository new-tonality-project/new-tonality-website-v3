'use client'

import { useMemo, useState } from 'react'
import { Chart } from '@highcharts/react'
import type Highcharts from 'highcharts'
import { DragNumberInput } from '@/components'
import { COLORS } from '@/lib/colors'
import {
  DEFAULT_PERIODS,
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REFERENCE_FREQUENCY,
  generateWaveforms,
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

function WaveformChart({
  title,
  data,
  color,
  durationMs,
  showXAxis = false,
}: {
  title: string
  data: [number, number][]
  color: string
  durationMs: number
  showXAxis?: boolean
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
          visible: showXAxis,
          title: showXAxis ? { text: 'Time (ms)', margin: 0 } : undefined,
        },
        series: [
          {
            type: 'line',
            data,
            color,
          },
        ],
      }) as Highcharts.Options,
    [title, data, color, durationMs, showXAxis],
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2" >
        <div className="flex flex-wrap items-center gap-2">

          <DragNumberInput
            defaultValue={10}
            value={intervalCents}
            min={0}
            max={4800}
            minStep={0.1}
            valueRange={100}
            label="Interval (cents)"
            onChange={setIntervalCents}
          />
          <DragNumberInput
            defaultValue={1}
            value={amplitude}
            min={0}
            max={1}
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
            valueRange={90}
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
        </div>
      </div>

      <div className="flex flex-col">
        <WaveformChart
          title={`Reference tone (${referenceFrequency} Hz)`}
          data={waveforms.reference}
          color={COLORS.blue}
          durationMs={waveforms.durationMs}
        />
        <WaveformChart
          title={`Interval tone (${waveforms.intervalFrequency.toFixed(2)} Hz)`}
          data={waveforms.intervalTone}
          color={COLORS.orange}
          durationMs={waveforms.durationMs}
        />
        <WaveformChart
          title="Sum"
          data={waveforms.sum}
          color={COLORS.green}
          durationMs={waveforms.durationMs}
          showXAxis
        />
      </div>
    </div>
  )
}
