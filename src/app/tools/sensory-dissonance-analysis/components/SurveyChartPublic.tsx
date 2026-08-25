'use client'

import { db } from '@/db'
import { useMemo, useState } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import 'highcharts/highcharts-more';
import { Spectrum } from 'tuning-core'
import { SignInButton } from '@clerk/nextjs'
import { ChartHeader } from './ChartHeader'
import { Button } from '@/components'
import { baseChartConfig, chartCredits, getStackedChartLayout } from './chartConfig'
import type { ChartSettings } from './types'
import { useDissonanceCurve, type UseDissonanceCurveOptions } from '@/hooks'
import {
  useChartPlotBounds,
  DissonanceChartOverlay,
} from './DissonanceChartOverlay'
import { getVolumeForFrequency } from '../utils'
import { getPnlCurvesInCents, getPnlMeanFrequencyForSurvey } from '../const'
import { CHART_COLORS } from '@/lib/colors'

export function SurveyChartPublic(props: {
  meanFrequency: number
  title: string
  settings: ChartSettings
  volume?: number
  hideLegend?: boolean
  hideXAxis?: boolean
}) {
  const allGraphs = db.useQuery({
    dissonanceGraphs: {
      $: {
        where:
          props.settings.userBackground !== undefined
            ? {
                meanFrequency: props.meanFrequency,
                userBackground: props.settings.userBackground,
              }
            : {
                meanFrequency: props.meanFrequency,
              },
      },
      intervalDissonanceScores: {
        $: {
          order: {
            interval: 'asc',
          },
        },
      },
    },
  })

  const graphs = useMemo(() => {
    return allGraphs.data?.dissonanceGraphs.map((graph) => ({
      id: graph.id,
      points: graph.intervalDissonanceScores.map((item) => ({
        x: item.interval,
        y: item.averageRating,
      })),
    }))
  }, [allGraphs])

  const [playedInterval, setPlayedInterval] = useState<number | null>(null)
  const [playedIntervalMouseY, setPlayedIntervalMouseY] = useState<number | undefined>(undefined)
  const { plotBounds, chartEvents } = useChartPlotBounds()

  const dissonanceCurveOptions = useMemo((): UseDissonanceCurveOptions => {
    const {
      xAxisStart,
      xAxisEnd,
      showAverage,
      showExponentialFit,
      showPnLResults,
      userBackground,
      ...dissonanceParams
    } = props.settings
    return {
      ...dissonanceParams,
      context: Spectrum.harmonic(1, props.meanFrequency),
      complement: Spectrum.harmonic(1, props.meanFrequency),
      start: Math.pow(2, xAxisStart / 1200),
      end: Math.pow(2, xAxisEnd / 1200),
      normalize: { min: 0, max: dissonanceParams.firstOrderDissonance.magnitude ?? 1 }
    }
  }, [props.meanFrequency, props.settings])
  const dissonanceCurve = useDissonanceCurve(dissonanceCurveOptions)

  const stackedLayout = getStackedChartLayout(props.hideLegend, props.hideXAxis)

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = [];
    const pnlMeanFrequency =
      getPnlMeanFrequencyForSurvey(props.meanFrequency) ?? props.meanFrequency
    const pnlLegendName = `P&L (${pnlMeanFrequency}Hz)`;

    (graphs || []).forEach((graph, index) => {
      series.push({
        type: 'spline',
        yAxis: "dissonance-score",
        data: graph.points.map((point) => [point.x, point.y]),
        name: index === 0 ? 'Other participants' : undefined,
        color:
          CHART_COLORS.otherParticipants[
            index % CHART_COLORS.otherParticipants.length
          ],
        lineWidth: 1,
        visible: props.settings.showOtherParticipants,
        enableMouseTracking: false,
        showInLegend: index === 0,
        marker: {
          enabled: false,
        },
      })
    })

    const pnlCurves = getPnlCurvesInCents(props.meanFrequency)
    if (pnlCurves) {
      const rangeData = pnlCurves.lower.map((lowerPoint, index) => {
        const upperPoint = pnlCurves.upper[index]
        return [lowerPoint.x, lowerPoint.y, upperPoint.y]
      })

      series.push({
        type: 'arearange',
        name: pnlLegendName,
        yAxis: 'dissonance-score',
        data: rangeData,
        color: CHART_COLORS.pnl,
        fillOpacity: 0.2,
        lineWidth: 0,
        visible: props.settings.showPnLResults,
        marker: { enabled: false },
        enableMouseTracking: false,
        showInLegend: false,
      })
      series.push({
        type: 'line',
        name: pnlLegendName,
        yAxis: 'dissonance-score',
        data: pnlCurves.mean.map((point) => [point.x, point.y]),
        color: CHART_COLORS.pnl,
        lineWidth: 1,
        visible: props.settings.showPnLResults,
        marker: {
          enabled: true,
          radius: 3,
          symbol: 'circle',
          fillColor: 'transparent',
          lineColor: CHART_COLORS.pnl,
          lineWidth: 1,
        },
        enableMouseTracking: false,
        showInLegend: true,
      })
    }

    series.push({
      type: 'spline',
      name: 'Theoretical fit',
      yAxis: "dissonance-curve",
      data: dissonanceCurve.plotCents(),
      color: CHART_COLORS.theoreticalFit,
      lineWidth: 2,
      visible: props.settings.showExponentialFit,
      enableMouseTracking: false,
      marker: { enabled: false },
    });

    return {
      ...baseChartConfig,
      chart: {
        ...baseChartConfig.chart,
        ...chartEvents,
        ...stackedLayout.chart,
      },
      legend: {
        ...baseChartConfig.legend,
        ...stackedLayout.legend,
      },
      xAxis: {
        ...baseChartConfig.xAxis,
        ...stackedLayout.xAxis,
        min: props.settings.xAxisStart,
        max: props.settings.xAxisEnd,
        plotBands:
          playedInterval != null
            ? [
                {
                  from: playedInterval - 7.5,
                  to: playedInterval + 7.5,
                  color: CHART_COLORS.playedIntervalBand,
                  borderColor: CHART_COLORS.playedIntervalBorder,
                  borderWidth: 1,
                  zIndex: 1,
                },
              ]
            : [],
      },
      credits: chartCredits,
      yAxis: [
        {
          id: "dissonance-score",
          title: { text: 'Dissonance score', rotation: -90 },
          min: 1,
          max: 7,
          tickInterval: 1,
          gridLineColor: '#ccc',
          gridLineDashStyle: 'Dash',
          alignTicks: false,
        },
        {
          id: "dissonance-curve",
          min: 0,
          max: 1,
          endOnTick: false,
          maxPadding: 0,
          opposite: true,
          visible: true,
          gridLineWidth: 0,
          title: {
            text: "Sensory dissonance D(f)",
            style: { color: props.settings.showExponentialFit ? undefined : 'transparent' },
          },
          labels: {
            style: { color: props.settings.showExponentialFit ? undefined : 'transparent' },
          },
        },
      ],
      plotOptions: {
        line: {
          animation: false,
        },
      },
      series,
    } as Highcharts.Options
  }, [graphs, dissonanceCurve, props.settings, props.meanFrequency, chartEvents, playedInterval, props.hideLegend, props.hideXAxis])

  if (allGraphs.isLoading) {
    return <div className="w-full rounded bg-neutral-100" style={{ height: stackedLayout.height }} />
  }

  if (allGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative w-full">
      <div className="relative grid w-full *:col-start-1 *:row-start-1">
          {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
          <Chart highcharts={Highcharts} options={chartOptions} containerProps={{ className: 'w-full' }} />
          <DissonanceChartOverlay
            plotBounds={plotBounds}
            meanFrequency={props.meanFrequency}
            volume={props.volume ?? getVolumeForFrequency(props.meanFrequency)}
            xAxisMin={props.settings.xAxisStart}
            xAxisMax={props.settings.xAxisEnd}
            onIntervalChange={(interval, mouseY) => {
              setPlayedInterval(interval)
              setPlayedIntervalMouseY(mouseY)
            }}
          />
          {playedInterval != null && plotBounds && playedIntervalMouseY != null && (
            <div
              className="pointer-events-none absolute z-10 whitespace-nowrap text-xs font-medium text-red-600"
              style={{
                left: plotBounds.left + ((playedInterval - props.settings.xAxisStart) / (props.settings.xAxisEnd - props.settings.xAxisStart)) * plotBounds.width,
                top: playedIntervalMouseY,
                transform: playedInterval > 600 ? 'translateX(calc(-100% - 12px))' : 'translateX(12px)',
              }}
            >
              {playedInterval} cents
            </div>
          )}
          <ChartHeader
            title={props.title}
            plotBounds={plotBounds}
            button={
              <SignInButton>
                <Button className="px-2 py-1! text-xs" variant="secondary">
                  Login to participate
                </Button>
              </SignInButton>
            }
          />
        </div>
    </div>
  )
}
