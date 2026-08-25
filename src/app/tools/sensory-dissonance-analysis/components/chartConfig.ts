import type Highcharts from 'highcharts'
import { CHART_COLORS } from '@/lib/colors'

const STACKED_PLOT_HEIGHT = 180
const STACKED_LEGEND_HEIGHT = 36
const STACKED_XAXIS_HEIGHT = 52
const STACKED_MARGIN_TOP = 4
const STACKED_MARGIN_BOTTOM = 0
const STACKED_MARGIN_LEFT = 48
const STACKED_MARGIN_RIGHT = 64

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
      // Let top/bottom axis labels paint outside the SVG so stacked charts
      // can stay flush without clipping tick values.
      style: { overflow: 'visible' },
      ...(hideLegend ? { marginTop: STACKED_MARGIN_TOP } : {}),
    } satisfies Highcharts.ChartOptions,
    legend: {
      enabled: !hideLegend,
      align: 'left',
      verticalAlign: 'top',
      layout: 'horizontal',
      margin: 12,
      padding: 4,
      y: 0,
      x: 0,
    } satisfies Highcharts.LegendOptions,
    xAxis: {
      title: hideXAxis
        ? { text: undefined, margin: 0 }
        : { text: 'Interval (cents)', margin: 8 },
      labels: { enabled: !hideXAxis },
      tickLength: hideXAxis ? 0 : 8,
      lineWidth: hideXAxis ? 0 : 1,
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
    align: 'left',
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

