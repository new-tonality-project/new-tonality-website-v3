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
  centsToRatio,
  createSpectrumFromHarmonics,
  getHarmonicsAmplitudeAxisBounds,
  getToneSpectrumPartials,
  type SpectrumPartial,
} from '../utils'
import type { SpectrumHarmonic } from '@/lib/spectrum'

const GRID_LINE_EVERY_CENTS = 100

function getCentsAxisTickConfig(minCents: number, maxCents: number) {
  const range = maxCents - minCents
  const tickInterval = range > 1200 ? 200 : 100

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

function filterPartialsInRange(
  partials: SpectrumPartial[],
  minCents: number,
  maxCents: number,
) {
  return partials.filter(
    (partial) => partial.cents >= minCents && partial.cents <= maxCents,
  )
}

function createRealHarmonicSeries({
  name,
  partials,
  color,
}: {
  name: string
  partials: SpectrumPartial[]
  color: string
}): Highcharts.SeriesOptionsType | null {
  const realPartials = partials.filter((partial) => !partial.phantom)

  if (realPartials.length === 0) {
    return null
  }

  return {
    type: 'column',
    name,
    yAxis: 'amplitude',
    data: realPartials.map((partial) => ({
      x: partial.cents,
      y: partial.amplitude,
    })),
    color,
    opacity: 1,
    borderWidth: 0,
    pointWidth: 3,
    grouping: false,
    legendSymbol: 'lineMarker',
    enableMouseTracking: false,
    showInLegend: true,
  }
}

function createPhantomHarmonicSeries({
  partials,
  color,
}: {
  partials: SpectrumPartial[]
  color: string
}): Highcharts.SeriesOptionsType | null {
  const phantomPartials = partials.filter((partial) => partial.phantom)

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
  partials,
  color,
}: {
  name: string
  partials: SpectrumPartial[]
  color: string
}): {
  real: Highcharts.SeriesOptionsType | null
  phantom: Highcharts.SeriesOptionsType | null
} {
  return {
    real: createRealHarmonicSeries({ name, partials, color }),
    phantom: createPhantomHarmonicSeries({ partials, color }),
  }
}

export function DissonanceCurveChart({
  referenceFrequency,
  intervalCents,
  amplitude,
  referenceHarmonics,
  intervalHarmonics,
  phantomHarmonicsNumber,
  secondOrderBeatingContribution,
  thirdOrderBeatingContribution,
  dissonanceCurveMinCents,
  dissonanceCurveMaxCents,
}: {
  referenceFrequency: number
  intervalCents: number
  amplitude: number
  referenceHarmonics: SpectrumHarmonic[]
  intervalHarmonics: SpectrumHarmonic[]
  phantomHarmonicsNumber: number
  secondOrderBeatingContribution: number
  thirdOrderBeatingContribution: number
  dissonanceCurveMinCents: number
  dissonanceCurveMaxCents: number
}) {
  const minCents = Math.min(dissonanceCurveMinCents, dissonanceCurveMaxCents)
  const maxCents = Math.max(dissonanceCurveMinCents, dissonanceCurveMaxCents)

  const referenceSpectrum = useMemo(
    () => createSpectrumFromHarmonics(referenceFrequency, referenceHarmonics, 1),
    [referenceFrequency, referenceHarmonics],
  )
  const intervalSpectrum = useMemo(
    () =>
      createSpectrumFromHarmonics(
        referenceFrequency,
        intervalHarmonics,
        amplitude,
      ),
    [amplitude, intervalHarmonics, referenceFrequency],
  )

  const dissonanceCurveOptions = useMemo((): UseDissonanceCurveOptions => {
    return {
      context: referenceSpectrum,
      complement: intervalSpectrum,
      start: centsToRatio(minCents),
      end: centsToRatio(maxCents),
      firstOrderDissonance: DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
      secondOrderDissonance: {
        ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
        magnitude: secondOrderBeatingContribution,
      },
      thirdOrderDissonance: {
        ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
        magnitude: thirdOrderBeatingContribution,
      },
      phantomHarmonicsNumber,
      normalize: { min: 0, max: 1 },
    }
  }, [
    intervalSpectrum,
    maxCents,
    minCents,
    phantomHarmonicsNumber,
    referenceSpectrum,
    secondOrderBeatingContribution,
    thirdOrderBeatingContribution,
  ])

  const dissonanceCurve = useDissonanceCurve(dissonanceCurveOptions)

  const options = useMemo((): Highcharts.Options => {
    const dissonanceData = dissonanceCurve
      .plotCents()
      .filter(([cents]) => cents >= minCents && cents <= maxCents)

    const referencePartials = filterPartialsInRange(
      getToneSpectrumPartials(
        referenceFrequency,
        0,
        1,
        referenceHarmonics,
        phantomHarmonicsNumber,
      ),
      minCents,
      maxCents,
    )
    const intervalPartials = filterPartialsInRange(
      getToneSpectrumPartials(
        referenceFrequency,
        intervalCents,
        amplitude,
        intervalHarmonics,
        phantomHarmonicsNumber,
      ),
      minCents,
      maxCents,
    )
    const visiblePartials = [...referencePartials, ...intervalPartials]
    const { min: amplitudeAxisMin, max: amplitudeAxisMax } =
      getHarmonicsAmplitudeAxisBounds(visiblePartials)
    const centsAxisTicks = getCentsAxisTickConfig(minCents, maxCents)

    const referenceHarmonicSeries = createHarmonicSeries({
      name: 'Reference tone',
      partials: referencePartials,
      color: COLORS.blue,
    })

    const intervalHarmonicSeries = createHarmonicSeries({
      name: 'Interval tone',
      partials: intervalPartials,
      color: COLORS.orange,
    })

    const harmonicSeries = [
      referenceHarmonicSeries.real,
      intervalHarmonicSeries.real,
      referenceHarmonicSeries.phantom,
      intervalHarmonicSeries.phantom,
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
        min: minCents,
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
        ...harmonicSeries,
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
  }, [
    amplitude,
    dissonanceCurve,
    intervalCents,
    intervalHarmonics,
    maxCents,
    minCents,
    phantomHarmonicsNumber,
    referenceFrequency,
    referenceHarmonics,
  ])

  return (
    <div className="relative mb-8 -ml-8 -mr-14">
      <div className="absolute top-6.5 right-14 z-10 text-xs text-zinc-600 dark:text-zinc-400">
        {`Intrinsic dissonance: ${roundToDecimals(dissonanceCurve.intrinsicDissonance?.dissonance ?? 0, 2)}`}
      </div>
      {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
      <Chart options={options} />
    </div>
  )
}
