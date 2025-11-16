import type Highcharts from 'highcharts'

export const baseChartConfig: Partial<Highcharts.Options> = {
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

