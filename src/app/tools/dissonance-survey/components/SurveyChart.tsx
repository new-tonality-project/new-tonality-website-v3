'use client'

import { Spinner } from '@/components'
import { db } from '@/db'
import { useMemo } from 'react'
import { XAxis, YAxis, LineChart, Line, CartesianGrid, Legend } from 'recharts'

export function SurveyChart() {
  const user = db.useUser()
  const userGraph = db.useQuery({
    dissonanceGraphs: {
      $: {
        where: {
          $users: user.id,
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
          $users: { $ne: user.id },
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

  if (userGraph.isLoading || otherGraphs.isLoading) {
    return <Spinner />
  }

  if (userGraph.error || otherGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="flex w-full flex-col items-center">
      <LineChart
        width={900}
        height={300}
        margin={{ bottom: 20, left: 0, right: 80, top: 20 }}
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
        {graphs.other?.map((graph) => (
          <Line
            key={graph.id}
            type="monotone"
            dot={false}
            activeDot={false}
            dataKey="y"
            data={graph.points}
            legendType='none'
            tooltipType='none'
            stroke="#ccc"
          />
        ))}
        {graphs.user?.map((graph) => (
          <Line
            key={graph.id}
            type="monotone"
            dataKey="y"
            name="Your result"
            data={graph.points}
            stroke="#000"
            strokeWidth={2}
          />
        ))}
        <Legend verticalAlign="top" height={36} />
      </LineChart>
    </div>
  )
}
