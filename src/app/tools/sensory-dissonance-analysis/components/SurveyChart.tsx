'use client'

import { db } from '@/db'
import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'
import { ChartHeader } from './ChartHeader'
import { getIntervalFrequencies } from '@/lib'
import { baseChartConfig } from './chartConfig'

export function SurveyChart(props: { meanFrequency: number; title: string }) {
  const [surveyOpen, setSurveyOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<Highcharts.Point | null>(
    null,
  )
  const synthRef = useRef<AdditiveSynth | null>(null)
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

  useEffect(() => {
    if (typeof AudioContext !== 'undefined' && !synthRef.current) {
      synthRef.current = new AdditiveSynth({
        spectrum: [{ partials: [{ rate: 1, amplitude: 0.2 }] }],
        audioContext: new AudioContext(),
        adsr: { attack: 0.1, sustain: 1, release: 0.1, decay: 0 },
      })
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.releaseAll()
      }
    }
  }, [])

  useEffect(() => {
    if (!synthRef.current) return

    if (!selectedPoint) {
      synthRef.current.releaseAll()
      return
    }

    const interval = selectedPoint.x
    const [f1, f2] = getIntervalFrequencies(interval, props.meanFrequency)

    synthRef.current.releaseAll()

    if (f1 !== f2) {
      synthRef.current.play({ pitch: f1, velocity: 0.5 })
      synthRef.current.play({ pitch: f2, velocity: 0.5 })
    } else {
      synthRef.current.play({ pitch: f1, velocity: 0.5 })
    }
  }, [selectedPoint, props.meanFrequency])

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
        data: graph.points.map((point) => [point.x, point.y]),
        color: '#ccc',
        lineWidth: 1,
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
              fillColor: isSelected ? '#85ffa9' : 'black',
              lineColor: isSelected ? 'black' : 'black',
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

    return {
      ...baseChartConfig,
      credits: {
        enabled: graphs.user && graphs.user.length > 0 ? true : false,
        text: '* clicking on a point will play the interval',
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
    } as Highcharts.Options
  }, [graphs, selectedPoint, handlePointClick])

  if (userGraph.isLoading || otherGraphs.isLoading || userSettings.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (userGraph.error || otherGraphs.error || userSettings.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <ChartHeader
        title={props.title}
        onTakeSurvey={
          !userGraph.data?.dissonanceGraphs?.length
            ? () => setSurveyOpen(true)
            : undefined
        }
      />
      <div className="mt-6 w-full overflow-x-auto lg:overflow-x-visible">
        <div className="min-w-[600px] lg:w-full lg:min-w-0">
          <Chart highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>

      <SurveyMachineProvider
        meanFrequency={props.meanFrequency}
        userSettings={userSettings.data.userSettings[0]}
      >
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
    </div>
  )
}
