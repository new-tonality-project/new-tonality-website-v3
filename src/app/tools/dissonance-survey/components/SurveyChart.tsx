'use client'

import { Spinner } from '@/components'
import { db } from '@/db'
import { useMemo } from 'react'
import { XAxis, YAxis, LineChart, Line } from 'recharts'

export function SurveyChart() {
  const { isLoading, error, data } = db.useQuery({
    intervalDissonanceScores: {
      $: {
        order: {
          interval: 'asc',
        },
      },
    },
  })
  const points = useMemo(() => {
    return data?.intervalDissonanceScores.map((item) => ({
      x: item.interval,
      y: item.rating1,
    }))
  }, [data])

  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <div>Error loading results</div>
  }

  return (
    <LineChart width={900} height={300}>
      <XAxis
        dataKey="x"
        type="number"
        name="Interval"
        domain={[0, 1200]}
        tickCount={13}
      />
      <YAxis dataKey="y" type="number" name="Dissoannce" tickCount={8} domain={[0, 7]} />

      <Line
        type="monotone"
        dataKey="y"
        name="Intervals"
        data={points}
        stroke="#8884d8"
      />
    </LineChart>
  )
}
