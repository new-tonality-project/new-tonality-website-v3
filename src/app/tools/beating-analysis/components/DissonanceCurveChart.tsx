'use client'

import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import type Highcharts from 'highcharts'
import { useDissonanceCurve, type UseDissonanceCurveOptions } from '@/hooks'
import { COLORS } from '@/lib/colors'
import { roundToDecimals } from '@/lib/utils'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import {
  createPureToneSpectrum,
  DISSONANCE_CURVE_END_RATIO,
  DISSONANCE_CURVE_START_RATIO,
  frequencyFromCents,
} from '../utils'

function createToneStemSeries({
  name,
  frequency,
  amplitude,
  color,
}: {
  name: string
  frequency: number
  amplitude: number
  color: string
}): Highcharts.SeriesOptionsType[] {
  return [
    {
      type: 'line',
      name,
      yAxis: 'amplitude',
      data: [
        [frequency, 0],
        [frequency, amplitude],
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
      data: [[frequency, amplitude]],
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
  const intervalFrequency = frequencyFromCents(referenceFrequency, intervalCents)
  const minFrequency = referenceFrequency * DISSONANCE_CURVE_START_RATIO
  const maxFrequency = Math.max(
    referenceFrequency * DISSONANCE_CURVE_END_RATIO,
    intervalFrequency * 1.05,
  )

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
    const dissonanceData = dissonanceCurve
      .plot()
      .map(([ratio, dissonance]) => [referenceFrequency * ratio, dissonance])

    const amplitudeAxisMax = Math.max(1, amplitude) * 1.25

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
        align: 'right',
        verticalAlign: 'top',
      },
      tooltip: { enabled: false },
      title: {
        text: 'Sensory dissonance curve',
        align: 'right',
        margin: 0,
        style: { fontSize: '14px', fontWeight: '600' },
      },
      xAxis: {
        type: 'linear',
        min: minFrequency,
        max: maxFrequency,
        title: { text: 'Frequency (Hz)', margin: 12 },
        gridLineColor: '#ddd',
        gridLineDashStyle: 'Dash',
        gridLineWidth: 1,
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
          frequency: referenceFrequency,
          amplitude: 1,
          color: COLORS.blue,
        }),
        ...createToneStemSeries({
          name: 'Interval tone',
          frequency: intervalFrequency,
          amplitude,
          color: COLORS.orange,
        }),
      ],
    }
  }, [
    amplitude,
    dissonanceCurve,
    intervalFrequency,
    maxFrequency,
    minFrequency,
    referenceFrequency,
  ])

  return (
    <div className='mb-8 -ml-8 -mr-14'>
      {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
      <Chart options={options} />
    </div>
  )
}
