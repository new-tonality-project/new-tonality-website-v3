import type { DissonanceParamsRecord } from './types'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'

export type DissonanceOrderParams = {
  magnitude: number
  magnitudeFrequencyDecay: number
  phantomNotchDepth: number
  x_star: number
  b1: number
  b2: number
  s1: number
  s2: number
}

export type DissonanceParamsState = {
  firstOrderDissonance: DissonanceOrderParams
  secondOrderDissonance: DissonanceOrderParams
  thirdOrderDissonance: DissonanceOrderParams
  phantomHarmonicsNumber: number
}

export const DEFAULT_DISSONANCE_PARAMS_STATE: DissonanceParamsState = {
  firstOrderDissonance: { ...DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS },
  secondOrderDissonance: { ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS },
  thirdOrderDissonance: { ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS },
  phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function mergeOrder(
  defaults: DissonanceOrderParams,
  layer: Partial<DissonanceOrderParams>,
): DissonanceOrderParams {
  const result = { ...defaults }

  for (const key of Object.keys(result) as (keyof DissonanceOrderParams)[]) {
    const value = layer[key]
    if (isFiniteNumber(value)) {
      result[key] = value
    }
  }

  return result
}

function persistOrder(
  prefix: 'firstOrder' | 'secondOrder' | 'thirdOrder',
  params: DissonanceOrderParams,
) {
  return {
    [`${prefix}Magnitude`]: params.magnitude,
    [`${prefix}XStar`]: params.x_star,
    [`${prefix}B1`]: params.b1,
    [`${prefix}B2`]: params.b2,
    [`${prefix}S1`]: params.s1,
    [`${prefix}S2`]: params.s2,
    [`${prefix}MagnitudeFrequencyDecay`]: params.magnitudeFrequencyDecay,
    [`${prefix}PhantomNotchDepth`]: params.phantomNotchDepth,
  }
}

function orderFromRecord(
  record: DissonanceParamsRecord,
  prefix: 'firstOrder' | 'secondOrder' | 'thirdOrder',
): Partial<DissonanceOrderParams> {
  return {
    magnitude: record[`${prefix}Magnitude`],
    x_star: record[`${prefix}XStar`],
    b1: record[`${prefix}B1`],
    b2: record[`${prefix}B2`],
    s1: record[`${prefix}S1`],
    s2: record[`${prefix}S2`],
    magnitudeFrequencyDecay: record[`${prefix}MagnitudeFrequencyDecay`],
    phantomNotchDepth: record[`${prefix}PhantomNotchDepth`],
  }
}

export function toPersistedDissonanceParams(settings: DissonanceParamsState) {
  return {
    phantomHarmonicsNumber: settings.phantomHarmonicsNumber,
    ...persistOrder('firstOrder', settings.firstOrderDissonance),
    ...persistOrder('secondOrder', settings.secondOrderDissonance),
    ...persistOrder('thirdOrder', settings.thirdOrderDissonance),
  }
}

export function mapDissonanceParamsRecordToState(
  record: DissonanceParamsRecord,
): DissonanceParamsState {
  return {
    firstOrderDissonance: mergeOrder(
      DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
      orderFromRecord(record, 'firstOrder'),
    ),
    secondOrderDissonance: mergeOrder(
      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      orderFromRecord(record, 'secondOrder'),
    ),
    thirdOrderDissonance: mergeOrder(
      DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      orderFromRecord(record, 'thirdOrder'),
    ),
    phantomHarmonicsNumber: isFiniteNumber(record.phantomHarmonicsNumber)
      ? record.phantomHarmonicsNumber
      : DEFAULT_DISSONANCE_PARAMS_STATE.phantomHarmonicsNumber,
  }
}
