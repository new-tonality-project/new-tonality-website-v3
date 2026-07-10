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
  '#1a4a6399',
  '#2d6d8a99',
  '#3f90b199',
  '#56B4E999',
  '#72c0ec99',
  '#8eccf099',
  '#aad8f499',
  '#c6e4f899',
] as const

export const CHART_COLORS = {
  otherParticipants: SKY_BLUE_TINTS,
  yourResult: COLORS.orange,
  theoreticalFit: COLORS.black,
  pnl: COLORS.green,
  selectedPoint: COLORS.blue,
  playedIntervalBand: COLORS.orange20,
  playedIntervalBorder: COLORS.orange,
} as const
