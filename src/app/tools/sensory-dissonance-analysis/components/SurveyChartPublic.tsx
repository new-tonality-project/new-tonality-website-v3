'use client'

import { db } from '@/db'
import { useMemo } from 'react'
import { Chart } from '@highcharts/react'
import Highcharts from 'highcharts'
import { Spectrum } from 'tuning-core'
import { SignInButton } from '@clerk/nextjs'
import { ChartHeader } from './ChartHeader'
import { Button } from '@/components'
import { baseChartConfig } from './chartConfig'
import { useDissonanceCurve } from '@/hooks'
import type { DissonanceCurveParams } from './DissonanceCurveControls'

export function SurveyChartPublic(props: {
  meanFrequency: number
  title: string
  dissonanceParams: DissonanceCurveParams
}) {
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

  const dissonanceCurveOptions = useMemo(
    () => ({
      context: Spectrum.harmonic(1, props.meanFrequency),
      complement: Spectrum.harmonic(1, props.meanFrequency),
      start: 1,
      end: 2,
      ...props.dissonanceParams,
    }),
    [props.meanFrequency, props.dissonanceParams]
  )
  const dissonanceCurve = useDissonanceCurve(dissonanceCurveOptions)

  const chartOptions = useMemo(() => {
    const series: Highcharts.SeriesOptionsType[] = []

    series.push({
      type: 'line',
      name: 'Theoretical curve',
      data: dissonanceCurve.plotCents(),
      color: 'red',
      lineWidth: 2,
      yAxis: 1,
      enableMouseTracking: false,
      marker: { enabled: false },
    });

    (graphs || []).forEach((graph, index) => {
      series.push({
        type: 'spline',
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

    return {
      ...baseChartConfig,
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
          title: { text: undefined },
          min: 0,
          opposite: true,
          labels: { enabled: false },
          gridLineWidth: 0,
        },
      ],
      plotOptions: {
        line: {
          animation: false,
        },
      },
      series,
    } as Highcharts.Options
  }, [graphs, dissonanceCurve])

  if (allGraphs.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (allGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <div className="min-w-[600px] lg:w-full lg:min-w-0">
          <Chart highcharts={Highcharts} options={chartOptions} />
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
