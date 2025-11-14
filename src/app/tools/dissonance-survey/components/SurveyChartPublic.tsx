'use client'

import { db } from '@/db'
import { useMemo } from 'react'
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
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
            <Button variant="secondary">Discover your curve</Button>
          </SignInButton>
        }
      />
      <ResponsiveContainer width="100%" height={300} className="mt-6">
        <LineChart
          height={300}
          margin={{ bottom: 20, left: 0, right: 10, top: 10 }}
        >
          <XAxis
            dataKey="x"
            type="number"
            name="Interval"
            label={{
              value: 'Interval (cents)',
              angle: 0,
              position: 'insideBottom',
              offset: -15,
            }}
            domain={[0, 1200]}
            tickCount={13}
          />
          <YAxis
            dataKey="y"
            type="number"
            name="Dissonance"
            label={{
              value: 'Dissonance score',
              angle: -90,
              position: 'outsideLeft',
            }}
            tickCount={7}
            domain={[1, 7]}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          {graphs?.map((graph) => (
            <Line
              key={graph.id}
              type="monotone"
              dot={false}
              activeDot={false}
              dataKey="y"
              data={graph.points}
              legendType="none"
              tooltipType="none"
              stroke="#444"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
