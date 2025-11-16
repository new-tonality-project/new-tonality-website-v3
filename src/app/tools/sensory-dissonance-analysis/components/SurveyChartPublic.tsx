'use client'

import { db } from '@/db'
import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { SignInButton } from '@clerk/nextjs'
import { ChartHeader } from './ChartHeader'
import { Button } from '@/components'
import { baseChartConfig } from './chartConfig'

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
    const series: Highcharts.SeriesOptionsType[] = (graphs || []).map((graph, index) => ({
      type: 'spline',
      data: graph.points.map((point) => [point.x, point.y]),
      name: index === 0 ? 'Other participants' : undefined,
      color: '#444',
      lineWidth: 1,
      enableMouseTracking: false,
      showInLegend: index === 0,
      marker: {
        enabled: false,
      },
    }))

    return {
      ...baseChartConfig,
      plotOptions: {
        line: {
          animation: false,
        },
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
