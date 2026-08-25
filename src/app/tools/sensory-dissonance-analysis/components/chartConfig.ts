import type Highcharts from 'highcharts'
import { CHART_COLORS } from '@/lib/colors'

const STACKED_PLOT_HEIGHT = 220
const STACKED_LEGEND_HEIGHT = 24
const STACKED_XAXIS_HEIGHT = 52
const STACKED_MARGIN_TOP = 4
const STACKED_MARGIN_BOTTOM = 0
const STACKED_MARGIN_LEFT = 80
const STACKED_MARGIN_RIGHT = 80

export function getStackedChartLayout(
  hideLegend = false,
  hideXAxis = false,
) {
  const marginTop = hideLegend ? STACKED_MARGIN_TOP : STACKED_LEGEND_HEIGHT
  const marginBottom = hideXAxis ? STACKED_MARGIN_BOTTOM : STACKED_XAXIS_HEIGHT
  const height = marginTop + STACKED_PLOT_HEIGHT + marginBottom

  return {
    height,
    chart: {
      height,
      marginLeft: STACKED_MARGIN_LEFT,
      marginRight: STACKED_MARGIN_RIGHT,
      marginBottom,
      spacingTop: 0,
      spacingRight: 10,
      spacingBottom: 0,
      spacingLeft: 10,
      ...(hideLegend ? { marginTop: STACKED_MARGIN_TOP } : {}),
    } satisfies Highcharts.ChartOptions,
    legend: {
      enabled: !hideLegend,
      align: 'right',
      verticalAlign: 'top',
      layout: 'horizontal',
      margin: 0,
      padding: 4,
      y: 0,
    } satisfies Highcharts.LegendOptions,
    xAxis: {
      title: hideXAxis
        ? { text: undefined, margin: 0 }
        : { text: 'Interval (cents)', margin: 8 },
      labels: { enabled: !hideXAxis },
      tickLength: hideXAxis ? 0 : 8,
      lineWidth: 1,
    } satisfies Highcharts.XAxisOptions,
  }
}

export const baseChartConfig: Partial<Highcharts.Options> = {
  colors: Array.from(CHART_COLORS.otherParticipants),
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

export const chartCredits: Highcharts.CreditsOptions = {
  enabled: false,
  text: '',
  style: {
    fontSize: '12px',
    fontStyle: 'italic',
    color: '#999',
  },
}

