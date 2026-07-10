/** Accessible color palette (colorblind-friendly) */
export const COLORS = {
  black: '#000000',
  orange: '#D55E00',
  orange20: '#D55E0033',
  blue: '#0072B2',
  green: '#009E73',
  skyBlue: '#56B4E9',
  pink: '#CC79A7',
  yellow: '#D4B106',
} as const

/** Sky blue tints from dark to light, for overlapping participant curves */
export const SKY_BLUE_TINTS = [
  '#1a4a6377',
  '#2d6d8a77',
  '#3f90b177',
  '#56B4E977',
  '#72c0ec77',
  '#8eccf077',
  '#aad8f477',
  '#c6e4f877',
] as const

export const CHART_COLORS = {
  otherParticipants: SKY_BLUE_TINTS,
  yourResult: COLORS.black,
  theoreticalFit: COLORS.orange,
  pnl: COLORS.yellow,
  selectedPoint: COLORS.blue,
  playedIntervalBand: COLORS.orange20,
  playedIntervalBorder: COLORS.orange,
} as const
