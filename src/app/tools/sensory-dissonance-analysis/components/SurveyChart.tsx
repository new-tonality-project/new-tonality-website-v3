'use client'

import { db } from '@/db'
import { useMemo, useState, useCallback } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'
import { ChartHeader } from './ChartHeader'

export function SurveyChart(props: { meanFrequency: number; title: string }) {
  const [surveyOpen, setSurveyOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
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

  const handlePointClick = useCallback((point: Highcharts.Point) => {
    console.log(point)
    setSelectedPoint({ x: point.x as number, y: point.y as number })
  }, [])

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = []

    graphs.other?.forEach((graph) => {
      series.push({
        type: 'spline',
        data: graph.points.map((point) => [point.x, point.y]),
        color: '#ccc',
        lineWidth: 1,
        enableMouseTracking: false,
        showInLegend: false,
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
          const isSelected = selectedPoint && selectedPoint.x === point.x && selectedPoint.y === point.y
          return {
            x: point.x,
            y: point.y,
            marker: {
              enabled: true,
              radius: isSelected ? 6 : 4,
              fillColor: isSelected ? 'cyan' : 'black',
              lineColor: isSelected ? 'black' : 'black',
              lineWidth: isSelected ? 2 : 0,
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
      chart: {
        height: 300,
        backgroundColor: 'transparent',
      },
      title: {
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        title: {
          text: 'Interval (cents)',
        },
        min: 0,
        max: 1200,
        tickInterval: 100,
        gridLineColor: '#ccc',
        gridLineDashStyle: 'Dash',
      },
      yAxis: {
        title: {
          text: 'Dissonance score',
          rotation: -90,
        },
        min: 1,
        max: 7,
        tickInterval: 1,
        gridLineColor: '#ccc',
        gridLineDashStyle: 'Dash',
      },
      tooltip: {
        enabled: false,
        // formatter: function (this: Highcharts.Point) {
        //   // Only show tooltip for user's series
        //   if (this.series.name === 'Your result') {
        //     return `
        //       <div class="rounded-lg border border-zinc-200 p-2 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
        //         <p class="font-semibold text-sm leading-tight m-0">${this.x} cents</p>
        //         <p class="text-xs text-zinc-600 dark:text-zinc-400 leading-tight m-0">
        //           Score: ${this.y?.toFixed(2)}
        //         </p>
        //       </div>
        //     `
        //   }
        //   return false
        // },
        // useHTML: true,
      },
      plotOptions: {
        spline: {
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
        onTakeSurvey={!userGraph.data?.dissonanceGraphs?.length ? () => setSurveyOpen(true) : undefined}
      />
      <div className="mt-6 w-full overflow-x-auto lg:overflow-x-visible">
        <div className="min-w-[600px] lg:min-w-0 lg:w-full">
          <Chart highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>

      <SurveyMachineProvider meanFrequency={props.meanFrequency} userSettings={userSettings.data.userSettings[0]}>
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
    </div>
  )
}
