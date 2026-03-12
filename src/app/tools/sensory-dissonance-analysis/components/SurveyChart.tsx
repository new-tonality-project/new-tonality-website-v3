'use client'

import { db } from '@/db'
import { useMemo, useState, useCallback, useRef } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'
import { ChartHeader } from './ChartHeader'
import { baseChartConfig } from './chartConfig'
import type { ChartSettings } from './types'
import { useDissonanceCurve, type UseDissonanceCurveOptions } from '@/hooks'
import { Spectrum } from 'tuning-core'
import {
  useChartPlotBounds,
  DissonanceChartOverlay,
} from './DissonanceChartOverlay'
import { getVolumeForFrequency } from '../utils'

export function SurveyChart(props: {
  meanFrequency: number
  title: string
  settings: ChartSettings
  onTakeSurvey?: (open?: boolean) => void
  volume?: number
}) {
  const [surveyOpen, setSurveyOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<Highcharts.Point | null>(
    null,
  )
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
  const user = db.useUser()
  const userSettings = db.useQuery({
    userSettings: {
      $: {
        where: {
          $users: user.id,
        },
      },
    },
  })
  const userGraph = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
          and: [
            {
              $users: user?.id,
            },
            { meanFrequency: props.meanFrequency },
          ],
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
  const otherGraphs = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
          and: [
            { $users: { $ne: user?.id } },
            { meanFrequency: props.meanFrequency },
          ],
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
    return {
      user: userGraph.data?.dissonanceGraphs.map((graph) => ({
        id: graph.id,
        points: graph.intervalDissonanceScores.map((item) => ({
          x: item.interval,
          y: item.averageRating,
        })),
      })),
      other: otherGraphs.data?.dissonanceGraphs.map((graph) => ({
        id: graph.id,
        points: graph.intervalDissonanceScores.map((item) => ({
          x: item.interval,
          y: item.averageRating,
        })),
      })),
    }
  }, [userGraph, otherGraphs])

  const handlePointClick = useCallback(
    (point: Highcharts.Point) => {
      if (
        selectedPoint &&
        selectedPoint.x === point.x &&
        selectedPoint.y === point.y
      ) {
        setSelectedPoint(null)
        return
      }
      setSelectedPoint(point)
    },
    [selectedPoint],
  )

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = []

    graphs.other?.forEach((graph, index) => {
      series.push({
        type: 'spline',
        name: index === 0 ? 'Other participants' : undefined,
        yAxis: "dissonance-score",
        data: graph.points.map((point) => [point.x, point.y]),
        lineWidth: 1,
        opacity: 0.5,
        enableMouseTracking: false,
        showInLegend: index === 0,
        marker: {
          enabled: false,
        },
      })
    })

    graphs.user?.forEach((graph) => {
      series.push({
        type: 'spline',
        name: 'Your result',
        yAxis: "dissonance-score",
        data: graph.points.map((point) => {
          const isSelected =
            selectedPoint &&
            selectedPoint.x === point.x &&
            selectedPoint.y === point.y
          return {
            x: point.x,
            y: point.y,
            marker: {
              enabled: true,
              radius: isSelected ? 6 : 2,
              fillColor: isSelected ? '#85ffa9' : '#000',
              lineColor: isSelected ? 'black' : '#000',
              lineWidth: isSelected ? 2 : 2,
              symbol: 'circle',
              states: {
                hover: {
                  radius: 6,
                },
              },
            },
          }
        }),
        color: '#000',
        lineWidth: 2,
        enableMouseTracking: true,
        showInLegend: true,
      })
    })

    if (props.settings.showExponentialFit) {
      series.push({
        type: 'spline',
        name: 'Theoretical fit',
        yAxis: "dissonance-curve",
        data: dissonanceCurve.plotCents(),
        color: '#0099FF',
        lineWidth: 2,
        enableMouseTracking: false,
        marker: { enabled: false },
      })
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
      yAxis: [
        {
          id: 'dissonance-score',
          title: { text: 'Dissonance score', rotation: -90 },
          min: 1,
          max: 7,
          tickInterval: 1,
          gridLineColor: '#ccc',
          gridLineDashStyle: 'Dash',
          alignTicks: false,

        },
        {
          id: 'dissonance-curve',
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
      credits: {
        enabled: graphs.user && graphs.user.length > 0 ? true : false,
        text: '* press and drag on the chart to play intervals',
        style: {
          fontSize: '12px',
          fontStyle: 'italic',
          color: '#999',
        },
      },
      plotOptions: {
        spline: {
          animation: false,
          point: {
            events: {
              // eslint-disable-next-line react-hooks/unsupported-syntax
              click: function (this: Highcharts.Point) {
                if (this.series.name === 'Your result') {
                  handlePointClick(this)
                }
              },
            },
          },
        },
      },
      series,
    }
  }, [graphs.other, graphs.user, props.settings.showExponentialFit, props.settings.xAxisStart, props.settings.xAxisEnd, chartEvents, playedInterval, selectedPoint, dissonanceCurve, handlePointClick])

  if (userGraph.isLoading || otherGraphs.isLoading || userSettings.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (userGraph.error || otherGraphs.error || userSettings.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <div className="relative grid min-w-[600px] lg:w-full lg:min-w-0 *:col-start-1 *:row-start-1">
          {/* @ts-expect-error - Highcharts Options type incompatible with @highcharts/react props (version mismatch) */}
          <Chart options={chartOptions} containerProps={{ className: 'w-full min-h-[300px]' }} />
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

      <SurveyMachineProvider
        meanFrequency={props.meanFrequency}
        userSettings={userSettings.data.userSettings[0]}
      >
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
      <ChartHeader
        title={props.title}
        onTakeSurvey={
          !userGraph.data?.dissonanceGraphs?.length
            ? () => {
              setSurveyOpen(true)
              props.onTakeSurvey?.(true)
            }
            : undefined
        }
      />
    </div>
  )
}
