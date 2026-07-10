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
  '#1a4a63aa',
  '#2d6d8aaa',
  '#3f90b1aa',
  '#56B4E9aa',
  '#72c0ecaa',
  '#8eccf0aa',
  '#aad8f4aa',
  '#c6e4f8aa',
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
