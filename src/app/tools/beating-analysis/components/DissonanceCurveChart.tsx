'use client'

import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import type Highcharts from 'highcharts'
import { useDissonanceCurve, type UseDissonanceCurveOptions } from '@/hooks'
import { COLORS } from '@/lib/colors'
import { roundToDecimals } from '@/lib/utils'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import {
  createPureToneSpectrum,
  DISSONANCE_CURVE_END_RATIO,
  DISSONANCE_CURVE_MAX_CENTS,
  DISSONANCE_CURVE_START_RATIO,
} from '../utils'

const GRID_LINE_EVERY_CENTS = 100

function getCentsAxisTickConfig(maxCents: number) {
  const tickInterval = maxCents > 1200 ? 200 : 100

  if (tickInterval === GRID_LINE_EVERY_CENTS) {
    return {
      tickInterval,
      gridLineWidth: 1,
      gridLineColor: '#ddd',
      gridLineDashStyle: 'Dash' as const,
    }
  }

  return {
    tickInterval,
    gridLineWidth: 0,
    minorTickInterval: GRID_LINE_EVERY_CENTS,
    minorGridLineWidth: 1,
    minorGridLineColor: '#ddd',
    minorGridLineDashStyle: 'Dash' as const,
  }
}

function createToneStemSeries({
  name,
  intervalCents,
  amplitude,
  color,
}: {
  name: string
  intervalCents: number
  amplitude: number
  color: string
}): Highcharts.SeriesOptionsType[] {
  return [
    {
      type: 'line',
      name,
      yAxis: 'amplitude',
      data: [
        [intervalCents, 0],
        [intervalCents, amplitude],
      ],
      color,
      lineWidth: 1.5,
      marker: { enabled: false },
      enableMouseTracking: false,
      showInLegend: true,
    },
    {
      type: 'scatter',
      name: `${name} marker`,
      yAxis: 'amplitude',
      data: [[intervalCents, amplitude]],
      color,
      marker: {
        enabled: true,
        radius: 4,
        symbol: 'circle',
      },
      enableMouseTracking: false,
      showInLegend: false,
    },
  ]
}

export function DissonanceCurveChart({
  referenceFrequency,
  intervalCents,
  amplitude,
}: {
  referenceFrequency: number
  intervalCents: number
  amplitude: number
}) {
  const maxCents = Math.max(DISSONANCE_CURVE_MAX_CENTS, intervalCents * 1.05)

  const referenceSpectrum = useMemo(
    () => createPureToneSpectrum(referenceFrequency, 1),
    [referenceFrequency],
  )

  const dissonanceCurveOptions = useMemo((): UseDissonanceCurveOptions => {
    return {
      context: referenceSpectrum,
      complement: referenceSpectrum,
      start: DISSONANCE_CURVE_START_RATIO,
      end: DISSONANCE_CURVE_END_RATIO,
      firstOrderDissonance: DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
      secondOrderDissonance: {
        ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      },
      thirdOrderDissonance: {
        ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      },
      phantomHarmonicsNumber: 2,
      normalize: { min: 0, max: 1 },
    }
  }, [referenceSpectrum])

  const dissonanceCurve = useDissonanceCurve(dissonanceCurveOptions)

  const options = useMemo((): Highcharts.Options => {
    const dissonanceData = dissonanceCurve.plotCents()
    const amplitudeAxisMax = Math.max(1, amplitude) * 1.25
    const centsAxisTicks = getCentsAxisTickConfig(maxCents)

    return {
      chart: {
        height: 280,
        backgroundColor: 'transparent',
        animation: false,
        marginLeft: 80,
        marginRight: 80,
        spacingTop: 8,
        spacingBottom: 0,
      },
      credits: { enabled: false },
      legend: {
        enabled: true,
        align: 'left',
        verticalAlign: 'top',
        x: 64,
        y: 0,
      },
      tooltip: { enabled: false },
      title: {
        text: 'Beating analysis',
        align: 'left',
        margin: 0,
        x: 68,
        y: 10,
        style: { fontSize: '14px', fontWeight: '600' },
      },
      xAxis: {
        type: 'linear',
        min: 0,
        max: maxCents,
        title: { text: 'Interval (cents)', margin: 12 },
        ...centsAxisTicks,
        labels: {
          formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
            return String(roundToDecimals(this.value as number))
          },
        },
      },
      yAxis: [
        {
          id: 'amplitude',
          title: { text: 'Amplitude' },
          min: 0,
          max: amplitudeAxisMax,
          gridLineColor: '#ddd',
          gridLineDashStyle: 'Dash',
          gridLineWidth: 1,
        },
        {
          id: 'dissonance',
          title: { text: 'Dissonance D(f)' },
          min: 0,
          max: 1,
          opposite: true,
          gridLineWidth: 0,
        },
      ],
      plotOptions: {
        line: {
          animation: false,
          enableMouseTracking: false,
          marker: { enabled: false },
          states: {
            hover: { enabled: false },
            inactive: { enabled: false },
          },
        },
        scatter: {
          animation: false,
          enableMouseTracking: false,
          states: {
            hover: { enabled: false },
            inactive: { enabled: false },
          },
        },
      },
      series: [
        {
          type: 'line',
          name: 'Dissonance',
          yAxis: 'dissonance',
          data: dissonanceData,
          color: COLORS.black,
          lineWidth: 1.5,
        },
        ...createToneStemSeries({
          name: 'Reference tone',
          intervalCents: 0,
          amplitude: 1,
          color: COLORS.blue,
        }),
        ...createToneStemSeries({
          name: 'Interval tone',
          intervalCents,
          amplitude,
          color: COLORS.orange,
        }),
        {
          type: 'line',
          name: 'Sum',
          color: COLORS.green,
          data: [],
          showInLegend: true,
          enableMouseTracking: false,
          lineWidth: 2,
          marker: { enabled: false },
          states: { inactive: { enabled: false } },
        },
      ],
    }
  }, [amplitude, dissonanceCurve, intervalCents, maxCents])

  return (
    <div className="mb-8 -ml-8 -mr-14">
      {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
      <Chart options={options} />
    </div>
  )
}
