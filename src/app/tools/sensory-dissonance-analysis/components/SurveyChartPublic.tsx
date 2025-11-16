'use client'

import { db } from '@/db'
import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { SignInButton } from '@clerk/nextjs'
import { ChartHeader } from './ChartHeader'
import { Button } from '@/components'

export function SurveyChartPublic(props: { meanFrequency: number; title: string }) {
  const allGraphs = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
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

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = (graphs || []).map((graph) => ({
      type: 'line',
      data: graph.points.map((point) => [point.x, point.y]),
      color: '#444',
      lineWidth: 1,
      enableMouseTracking: false,
      showInLegend: false,
      marker: {
        enabled: false,
      },
    }))

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
      },
      series,
    } as Highcharts.Options
  }, [graphs])

  if (allGraphs.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (allGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <ChartHeader 
        title={props.title}
        button={
          <SignInButton>
            <Button variant="secondary">Login to participate</Button>
          </SignInButton>
        }
      />
      <div className="mt-6 w-full overflow-x-auto lg:overflow-x-visible">
        <div className="min-w-[600px] lg:min-w-0 lg:w-full">
          <Chart highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
