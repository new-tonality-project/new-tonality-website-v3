import { round } from "lodash-es";
import type { SecondOrderBeatingTerm } from "sethares-dissonance";

export const DEFAULT_SECOND_ORDER_TERMS: SecondOrderBeatingTerm[] = [
  {
    ratio: 2 / 1, // octave
    magnitude: 1 / 2,
  },
  {
    ratio: 3 / 2, // fifth
    magnitude: round(1 / 3, 2),
  },
  {
    ratio: round(4 / 3, 2), // fourth
    magnitude: 1 / 4,
  },
  {
    ratio: 5 / 4, // major third
    magnitude: 1 / 5,
  },
  {
    ratio: round(5 / 3, 2), // major sixth
    magnitude: round(1 / 6, 2),
  },
  {
    ratio: 6 / 5, // minor third
    magnitude: round(1 / 7, 2),
  },
  {
    ratio: 8 / 5, // minor sixth
    magnitude: 1 / 8,
  },
  {
    ratio: 9 / 8, // major second
    magnitude: 1 / 8,
  },
  {
    ratio: 9 / 5, // minor seventh
    magnitude: 1 / 10,
  },
  {
    ratio: 15 / 8, // major seventh
    magnitude: round(1 / 11, 2),
  },
  {
    ratio: round(16 / 15, 2), // minor second
    magnitude: round(1 / 12, 2),
  }
]
