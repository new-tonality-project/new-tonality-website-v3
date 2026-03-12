'use client'

import { db } from '@/db'
import { useMemo, useState } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { Spectrum } from 'tuning-core'
import { SignInButton } from '@clerk/nextjs'
import { ChartHeader } from './ChartHeader'
import { Button } from '@/components'
import { baseChartConfig } from './chartConfig'
import type { ChartSettings } from './types'
import { useDissonanceCurve, type UseDissonanceCurveOptions } from '@/hooks'
import {
  useChartPlotBounds,
  DissonanceChartOverlay,
} from './DissonanceChartOverlay'
import { getVolumeForFrequency } from '../utils'

export function SurveyChartPublic(props: {
  meanFrequency: number
  title: string
  settings: ChartSettings
  volume?: number
}) {
  const allGraphs = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
          meanFrequency: props.meanFrequency,
          userBackground: props.settings.userBackground,
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

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = [];

    (graphs || []).forEach((graph, index) => {
      series.push({
        type: 'spline',
        yAxis: "dissonance-score",
        data: graph.points.map((point) => [point.x, point.y]),
        name: index === 0 ? 'Other participants' : undefined,
        lineWidth: 1,
        opacity: 0.5,
        enableMouseTracking: false,
        showInLegend: index === 0,
        marker: {
          enabled: false,
        },
      })
    })

    if (props.settings.showExponentialFit) {
      series.push({
        type: 'spline',
        name: 'Theoretical fit',
        yAxis: "dissonance-curve",
        data: dissonanceCurve.plotCents(),
        color: 'black',
        lineWidth: 2,
        enableMouseTracking: false,
        marker: { enabled: false },
      });
    }

    return {
      ...baseChartConfig,
      chart: {
        ...baseChartConfig.chart,
        ...chartEvents,
      },
      xAxis: {
        ...baseChartConfig.xAxis,
        min: props.settings.xAxisStart,
        max: props.settings.xAxisEnd,
        plotBands:
          playedInterval != null
            ? [
                {
                  from: playedInterval - 7.5,
                  to: playedInterval + 7.5,
                  color: 'rgba(255, 0, 0, 0.2)',
                  borderColor: 'red',
                  borderWidth: 1,
                  zIndex: 1,
                },
              ]
            : [],
      },
      credits: {
        enabled: true,
        text: '* press and drag on the chart to play intervals',
        style: {
          fontSize: '12px',
          fontStyle: 'italic',
          color: '#999',
        },
      },
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
  }, [graphs, dissonanceCurve, props.settings, chartEvents, playedInterval])

  if (allGraphs.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (allGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <div className="relative min-w-[600px] lg:w-full lg:min-w-0">
          {/* @ts-expect-error - Highcharts Options type causes excessive stack depth when comparing with @highcharts/react props */}
          <Chart highcharts={Highcharts} options={chartOptions} />
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
        </div>
      </div>
      <ChartHeader
        title={props.title}
        button={
          <SignInButton>
            <Button className="px-2 py-1! text-xs" variant="secondary">
              Login to participate
            </Button>
          </SignInButton>
        }
      />
    </div>
  )
}
