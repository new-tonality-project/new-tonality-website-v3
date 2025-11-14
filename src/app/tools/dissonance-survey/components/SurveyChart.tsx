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
  Tooltip,
} from 'recharts'
import { SurveyMachineProvider } from '@/state/machines'
import { Survey } from './Survey'
import { ChartHeader } from './ChartHeader'

export function SurveyChart(props: { meanFrequency: number; title: string }) {
  const [surveyOpen, setSurveyOpen] = useState(false)
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
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload
                // Only show tooltip for user's line (black line)
                if (payload[0].dataKey === 'y' && payload[0].stroke === '#000') {
                  return (
                    <div className="rounded-lg border border-zinc-200 p-2 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                      <p className="font-semibold text-sm leading-tight m-0">{data.x} cents</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-tight m-0">
                        Score: {data.y.toFixed(2)}
                      </p>
                    </div>
                  )
                }
              }
              return null
            }}
          />
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
              activeDot={{ r: 6, fill: '#000' }}
              dataKey="y"
              name="Your result"
              data={graph.points}
              stroke="#000"
              strokeWidth={2}
            />
          ))}
        </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <SurveyMachineProvider meanFrequency={props.meanFrequency} userSettings={userSettings.data.userSettings[0]}>
        <Survey setSurveyOpen={setSurveyOpen} open={surveyOpen} />
      </SurveyMachineProvider>
    </div>
  )
}
