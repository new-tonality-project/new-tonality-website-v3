"use client"

import type { PlotPoint } from '@/lib'
import { ScatterChart, Scatter, XAxis, YAxis } from 'recharts'

export function SurveyChart(props: { data: PlotPoint[] }) {
  return (
    <ScatterChart width={900} height={300}>
      <XAxis dataKey="x" type="number" name="Interval" domain={[0, 1200]} tickCount={13} />
      <YAxis dataKey="y" type="number" name="Consonance" domain={[0, 1]} />

      <Scatter name="Intervals" data={props.data} fill="#8884d8" />
    </ScatterChart>
  )
}
