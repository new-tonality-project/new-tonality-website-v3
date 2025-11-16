'use client'

export function getClickedPoint(
  x: number,
  y: number,
  dataOnPlot: { x: number; y: number }[],
) {
  const allPoints = Array.from(document.querySelectorAll<HTMLElement>('.custom-dot'))

  for (let i = 0; i < allPoints.length; i++) {
    const { chartX, chartY, xValue, yValue, radius } = allPoints[i].dataset

    // calculate distance between 2 points
    const pointX = Number(chartX)
    const pointY = Number(chartY)
    const deltaX = x - pointX
    const deltaY = y - pointY
    const distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))

    // if distance <= radius, then clicked on a dot
    if (distance <= Number(radius)) {
      const dataPoint = dataOnPlot.find(
        (d) => d.x === Number(xValue) && d.y === Number(yValue),
      )
      if (dataPoint) {
        return dataPoint
      }
    }
  }
}

const RADIUS_SELECTED = 6
const RADIUS_UNSELECTED = 3
const COLOR_SELECTED = 'green'
const COLOR_UNSELECTED = 'red'

type CustomDotProps = {
  cx: number
  cy: number
  payload: { x: number; y: number }
  selectedPoint: { x: number; y: number } | null
}

export default function CustomDot(props: CustomDotProps) {
  const { cx, cy, payload, selectedPoint } = props
  const isSelected = selectedPoint &&
    selectedPoint.x === payload.x && selectedPoint.y === payload.y

  return (
    <g
    onClick={() => console.log('On dot')}
      className="custom-dot"
      data-chart-x={cx}
      data-chart-y={cy}
      data-x-value={payload.x}
      data-y-value={payload.y}
      data-radius={isSelected ? RADIUS_UNSELECTED : RADIUS_SELECTED}
    >
      {!isSelected ? (
        <circle cx={cx} cy={cy} r={RADIUS_UNSELECTED} fill={COLOR_UNSELECTED} />
      ) : (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={RADIUS_SELECTED / 2}
            fill={COLOR_SELECTED}
          />
          <circle
            cx={cx}
            cy={cy}
            r={RADIUS_SELECTED}
            fill="none"
            stroke={COLOR_SELECTED}
          />
        </>
      )}
    </g>
  )
}
