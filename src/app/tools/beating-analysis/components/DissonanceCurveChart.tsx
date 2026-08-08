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
  DISSONANCE_CURVE_START_RATIO,
  getHarmonicsAmplitudeAxisBounds,
  getHarmonicsMaxCents,
  getPureToneSpectrumPartials,
  type SpectrumPartial,
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

function createRealHarmonicSeries({
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
      type: 'column',
      name,
      yAxis: 'amplitude',
      data: [{ x: intervalCents, y: amplitude }],
      color,
      opacity: 1,
      borderWidth: 0,
      pointWidth: 3,
      grouping: false,
      legendSymbol: 'lineMarker',
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
        radius: 3,
        symbol: 'circle',
      },
      enableMouseTracking: false,
      showInLegend: false,
    },
  ]
}

function createPhantomHarmonicSeries({
  partials,
  color,
  maxCents,
}: {
  partials: SpectrumPartial[]
  color: string
  maxCents: number
}): Highcharts.SeriesOptionsType | null {
  const phantomPartials = partials.filter(
    (partial) => partial.phantom && partial.cents <= maxCents,
  )

  if (phantomPartials.length === 0) {
    return null
  }

  return {
    type: 'column',
    name: 'Phantom harmonics',
    yAxis: 'amplitude',
    data: phantomPartials.map((partial) => ({
      x: partial.cents,
      y: partial.amplitude,
    })),
    color,
    opacity: 0.75,
    borderWidth: 0,
    pointWidth: 2,
    grouping: false,
    enableMouseTracking: false,
    showInLegend: false,
  }
}

function createHarmonicSeries({
  name,
  intervalCents,
  amplitude,
  color,
  phantomHarmonicsNumber,
  maxCents,
}: {
  name: string
  intervalCents: number
  amplitude: number
  color: string
  phantomHarmonicsNumber: number
  maxCents: number
}): {
  real: Highcharts.SeriesOptionsType[]
  phantom: Highcharts.SeriesOptionsType | null
} {
  const partials = getPureToneSpectrumPartials(
    intervalCents,
    amplitude,
    phantomHarmonicsNumber,
  )

  return {
    real: createRealHarmonicSeries({ name, intervalCents, amplitude, color }),
    phantom: createPhantomHarmonicSeries({ partials, color, maxCents }),
  }
}

export function DissonanceCurveChart({
  referenceFrequency,
  intervalCents,
  amplitude,
  phantomHarmonicsNumber,
}: {
  referenceFrequency: number
  intervalCents: number
  amplitude: number
  phantomHarmonicsNumber: number
}) {
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
      phantomHarmonicsNumber,
      normalize: { min: 0, max: 1 },
    }
  }, [phantomHarmonicsNumber, referenceSpectrum])

  const dissonanceCurve = useDissonanceCurve(dissonanceCurveOptions)

  const options = useMemo((): Highcharts.Options => {
    const dissonanceData = dissonanceCurve.plotCents()
    const allPartials = [
      ...getPureToneSpectrumPartials(0, 1, phantomHarmonicsNumber),
      ...getPureToneSpectrumPartials(
        intervalCents,
        amplitude,
        phantomHarmonicsNumber,
      ),
    ]
    const maxCents = getHarmonicsMaxCents(
      intervalCents,
      amplitude,
      phantomHarmonicsNumber,
    )
    const { min: amplitudeAxisMin, max: amplitudeAxisMax } =
      getHarmonicsAmplitudeAxisBounds(allPartials)
    const centsAxisTicks = getCentsAxisTickConfig(maxCents)

    const referenceHarmonics = createHarmonicSeries({
      name: 'Reference tone',
      intervalCents: 0,
      amplitude: 1,
      color: COLORS.blue,
      phantomHarmonicsNumber,
      maxCents,
    })

    const intervalHarmonics = createHarmonicSeries({
      name: 'Interval tone',
      intervalCents,
      amplitude,
      color: COLORS.orange,
      phantomHarmonicsNumber,
      maxCents,
    })

    const phantomHarmonicSeries = [
      referenceHarmonics.phantom,
      intervalHarmonics.phantom,
    ].filter((series): series is Highcharts.SeriesOptionsType => series !== null)

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
          type: 'logarithmic',
          title: { text: 'Amplitude (log)' },
          min: amplitudeAxisMin,
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
        column: {
          animation: false,
          enableMouseTracking: false,
          borderWidth: 0,
          grouping: false,
          legendSymbol: 'rectangle',
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
        ...referenceHarmonics.real,
        ...intervalHarmonics.real,
        ...phantomHarmonicSeries,
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
  }, [amplitude, dissonanceCurve, intervalCents, phantomHarmonicsNumber])

  return (
    <div className="mb-8 -ml-8 -mr-14">
      {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
      <Chart options={options} />
    </div>
  )
}
