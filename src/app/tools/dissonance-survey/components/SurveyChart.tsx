'use client'

import { db } from '@/db'
import { useMemo, useState } from 'react'
import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { Button } from '@/components'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'

export function SurveyChart(props: { meanFrequency: number }) {
  const [surveyOpen, setSurveyOpen] = useState(false)
  const user = db.useUser()
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

  if (userGraph.isLoading || otherGraphs.isLoading) {
    return <div className="h-[300px] w-full rounded bg-neutral-100" />
  }

  if (userGraph.error || otherGraphs.error) {
    return <div>Error loading results</div>
  }

  return (
    <div className="relative flex w-full flex-col items-center">
      <ResponsiveContainer width="100%" height={300}>
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
          {graphs.other?.map((graph) => (
            <Line
              key={graph.id}
              type="monotone"
              dot={false}
              activeDot={false}
              dataKey="y"
              data={graph.points}
              legendType="none"
              tooltipType="none"
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
        </LineChart>
      </ResponsiveContainer>

      {!userGraph.data?.dissonanceGraphs?.length ? (
        <Button
          onClick={() => setSurveyOpen(true)}
          variant="primary"
          className="absolute top-6 right-8 max-w-fit"
        >
          Take a survey
        </Button>
      ) : null}

      <SurveyMachineProvider meanFrequency={props.meanFrequency}>
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
    </div>
  )
}
