import type { PlotPoint } from "@/lib";
import { round } from "lodash-es";
import { ratioToCents } from "tuning-core";

export const PNL_125_LOWER: PlotPoint[] = [
  { x: 5,   y: 1.65 },
  { x: 8,  y: 1.7 },
  { x: 11,  y: 1.65 },
  { x: 16,  y: 1.6 },
  { x: 21,  y: 1.8 },
  { x: 30,  y: 2.1 },
  { x: 40,  y: 3.3 },
  { x: 60, y: 3.85 },
  { x: 80, y: 4.25 },
  { x: 120, y: 5.5 },
  { x: 180, y: 6 },
  { x: 230, y: 6.05 },
];

export const PNL_125_MEAN: PlotPoint[] = [
  { x: 5,   y: 2 },
  { x: 8,  y: 2.2 },
  { x: 11,  y: 2.2 },
  { x: 16,  y: 2.4 },
  { x: 21,  y: 2.7 },
  { x: 30,  y: 3.4 },
  { x: 40, y: 3.6 },
  { x: 60, y: 5.00 },
  { x: 80, y: 5.20 },
  { x: 120, y: 5.80 },
  { x: 180, y: 6.0 },
  { x: 230, y: 6.20 },
];

export const PNL_125_UPPER: PlotPoint[] = [
  { x: 5,   y: 4.15 },
  { x: 8,  y: 3.9 },
  { x: 11,  y: 2.95 },
  { x: 16,  y: 2.95 },
  { x: 21,  y: 3.6 },
  { x: 30,  y: 4.25 },
  { x: 40,  y: 5.30 },
  { x: 60, y: 5.20 },
  { x: 80, y: 5.90 },
  { x: 120, y: 6.20 },
  { x: 180, y: 6.30 },
  { x: 230, y: 7.00 },
];

export const PNL_500_LOWER: PlotPoint[] = [
  { x: 8,    y: 2.5 },
  { x: 14,   y: 2.20 },
  { x: 19,   y: 1.6 },
  { x: 28,   y: 1.50 },
  { x: 40,   y: 2.00 },
  { x: 54,   y: 1.65 },
  { x: 75,  y: 3.1 },
  { x: 110,  y: 4.6 },
  { x: 160,  y: 4.20 },
  { x: 220,  y: 4.80 },
  { x: 300,  y: 5.05 },
  { x: 400,  y: 4.90 },
  { x: 650,  y: 5.6 },
  { x: 800, y: 4.00 },
];

export const PNL_500_MEAN: PlotPoint[] = [
  { x: 8,    y: 3.6 },
  { x: 14,   y: 3 },
  { x: 19,   y: 2.6 },
  { x: 28,   y: 2.4 },
  { x: 40,   y: 2.6 },
  { x: 54,   y: 2.7 },
  { x: 75,  y: 3.8 },
  { x: 110,  y: 5.8 },
  { x: 160,  y: 5.3 },
  { x: 220,  y: 5.8 },
  { x: 300,  y: 5.8 },
  { x: 400,  y: 5.8 },
  { x: 650,  y: 6.2 },
  { x: 800, y: 5.8 },
];

export const PNL_500_UPPER: PlotPoint[] = [
  { x: 8,    y: 5.2 },
  { x: 14,   y: 4 },
  { x: 19,   y: 3.7 },
  { x: 28,   y: 3.1 },
  { x: 40,   y: 2.95 },
  { x: 54,   y: 3.4 },
  { x: 75,  y: 5.15 },
  { x: 110,  y: 6.4 },
  { x: 160,  y: 5.95 },
  { x: 220,  y: 6.3 },
  { x: 300,  y: 6.15 },
  { x: 400,  y: 6.3 },
  { x: 650,  y: 6.55 },
  { x: 800, y: 6.4 },
];

export const PNL_1000_LOWER: PlotPoint[] = [
  { x: 17,   y: 2 },
  { x: 22,   y: 2 },
  { x: 32,   y: 1.6 },
  { x: 44,   y: 2 },
  { x: 63,   y: 1.8 },
  { x: 85,  y: 2.40 },
  { x: 120,  y: 3 },
  { x: 180,  y: 5.2 },
  { x: 250,  y: 4.8 },
  { x: 350,  y: 5.4 },
  { x: 500, y: 6 },
  { x: 700, y: 4.8 },
  { x: 1000, y: 5.8 },
  { x: 1400, y: 5 },
];

export const PNL_1000_MEAN: PlotPoint[] = [
  { x: 17,   y: 2.30 },
  { x: 22,   y: 2.80 },
  { x: 32,   y: 2.50 },
  { x: 44,   y: 2.20 },
  { x: 63,   y: 2.20 },
  { x: 85,  y: 3.2 },
  { x: 120,  y: 4.4 },
  { x: 180,  y: 6.5 },
  { x: 250,  y: 5.9 },
  { x: 350,  y: 5.6 },
  { x: 500, y: 6.4 },
  { x: 700, y: 5.8 },
  { x: 1000, y: 6.4 },
  { x: 1400, y: 6 },
];

export const PNL_1000_UPPER: PlotPoint[] = [
  { x: 17,   y: 3.8 },
  { x: 22,   y: 4 },
  { x: 32,   y: 2.8 },
  { x: 44,   y: 2.8 },
  { x: 63,   y: 3 },
  { x: 85,  y: 4 },
  { x: 120,  y: 5 },
  { x: 180,  y: 6.8 },
  { x: 250,  y: 6.2 },
  { x: 350,  y: 6 },
  { x: 500, y: 6.8 },
  { x: 700, y: 6.5 },
  { x: 1000, y: 6.6 },
  { x: 1400, y: 6.2 },
];

type PnlCurves = {
  lower: PlotPoint[]
  mean: PlotPoint[]
  upper: PlotPoint[]
}

const PNL_CURVES_BY_MEAN_FREQUENCY: Record<number, PnlCurves> = {
  125: {
    lower: PNL_125_LOWER,
    mean: PNL_125_MEAN,
    upper: PNL_125_UPPER,
  },
  500: {
    lower: PNL_500_LOWER,
    mean: PNL_500_MEAN,
    upper: PNL_500_UPPER,
  },
  1000: {
    lower: PNL_1000_LOWER,
    mean: PNL_1000_MEAN,
    upper: PNL_1000_UPPER,
  },
}

const SURVEY_TO_PNL_MEAN_FREQUENCY: Record<number, keyof typeof PNL_CURVES_BY_MEAN_FREQUENCY> = {
  147: 125,
  440: 500,
  1320: 1000,
}

export function getPnlMeanFrequencyForSurvey(
  meanFrequency: number,
): keyof typeof PNL_CURVES_BY_MEAN_FREQUENCY | null {
  return SURVEY_TO_PNL_MEAN_FREQUENCY[meanFrequency] ?? null
}

export function frequencyDifferenceToCents(
  meanFrequency: number,
  frequencyDifference: number,
): number {
  if (meanFrequency <= 0 || frequencyDifference <= 0) return 0

  const lowFreq = (Math.sqrt(frequencyDifference ** 2 + 4 * meanFrequency ** 2) - frequencyDifference) / 2
  const highFreq = lowFreq + frequencyDifference
  const ratio = round(highFreq / lowFreq, 3)

  if (ratio <= 0) return 0

  return ratioToCents(ratio).valueOf()
}

export function getPnlCurvesInCents(
  meanFrequency: number,
): PnlCurves | null {
  const pnlMeanFrequency = getPnlMeanFrequencyForSurvey(meanFrequency)
  if (!pnlMeanFrequency) return null

  const curves = PNL_CURVES_BY_MEAN_FREQUENCY[pnlMeanFrequency]
  if (!curves) return null

  const invertConsonanceToDissonance = (value: number) => 8 - value

  const toCents = (points: PlotPoint[]) =>
    points.map((point) => ({
      x: frequencyDifferenceToCents(meanFrequency, point.x),
      y: invertConsonanceToDissonance(point.y),
    }))

  return {
    lower: toCents(curves.lower),
    mean: toCents(curves.mean),
    upper: toCents(curves.upper),
  }
}
