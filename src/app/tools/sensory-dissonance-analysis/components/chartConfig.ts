import type Highcharts from 'highcharts'

/** Palette for "other participants" graphs — excludes bluish colors so user graph (#0099FF) stands out */
export const otherParticipantsColors = [
  '#e74c3c', // red
  '#27ae60', // green
  '#f39c12', // orange
  '#9b59b6', // purple
  '#e67e22', // dark orange
  '#ec4899', // pink
  '#84cc16', // lime
  '#059669', // emerald
  '#d97706', // amber
  '#dc2626', // darker red
]

export const baseChartConfig: Partial<Highcharts.Options> = {
  colors: otherParticipantsColors,
  chart: {
    height: 300,
    backgroundColor: 'transparent',
    animation: false,
  },
  title: {
    text: undefined,
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: true,
    align: 'right',
    verticalAlign: 'top',
    layout: 'horizontal',
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
    gridLineWidth: 1,
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
}

