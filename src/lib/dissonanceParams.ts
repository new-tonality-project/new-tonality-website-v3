import type { BeatingAnalysisSettings, DissonanceParamsRecord } from './types'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
  type DissonanceParams,
} from 'sethares-dissonance'

export type DissonanceParamsState = Required<DissonanceParams>

export const DEFAULT_DISSONANCE_PARAMS_STATE: DissonanceParamsState = {
  firstOrderDissonance: { ...DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS },
  secondOrderDissonance: { ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS },
  thirdOrderDissonance: { ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS },
  phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
}

export function parseDissonanceParamsJson(value: string | undefined | null) {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<
      Pick<
        DissonanceParamsState,
        | 'firstOrderDissonance'
        | 'secondOrderDissonance'
        | 'thirdOrderDissonance'
      >
    >

    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    return {
      firstOrderDissonance: {
        ...DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
        ...parsed.firstOrderDissonance,
      },
      secondOrderDissonance: {
        ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
        ...parsed.secondOrderDissonance,
      },
      thirdOrderDissonance: {
        ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
        ...parsed.thirdOrderDissonance,
      },
    }
  } catch {
    return null
  }
}

export function toPersistedDissonanceParams(settings: DissonanceParamsState) {
  const {
    firstOrderDissonance,
    secondOrderDissonance,
    thirdOrderDissonance,
    phantomHarmonicsNumber,
  } = settings

  return {
    phantomHarmonicsNumber,
    paramsJson: JSON.stringify({
      firstOrderDissonance,
      secondOrderDissonance,
      thirdOrderDissonance,
    }),
  }
}

export function mapDissonanceParamsRecordToState(
  record: DissonanceParamsRecord,
): DissonanceParamsState {
  const parsed = parseDissonanceParamsJson(record.paramsJson)

  return {
    firstOrderDissonance: {
      ...DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
      ...parsed?.firstOrderDissonance,
    },
    secondOrderDissonance: {
      ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      ...parsed?.secondOrderDissonance,
    },
    thirdOrderDissonance: {
      ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      ...parsed?.thirdOrderDissonance,
    },
    phantomHarmonicsNumber:
      record.phantomHarmonicsNumber ??
      DEFAULT_DISSONANCE_PARAMS_STATE.phantomHarmonicsNumber,
  }
}

export function dissonanceStateFromLegacyBeatingRecord(
  record: BeatingAnalysisSettings,
): DissonanceParamsState {
  const parsed = parseDissonanceParamsJson(record.dissonanceParamsJson)

  return {
    firstOrderDissonance:
      parsed?.firstOrderDissonance ??
      DEFAULT_DISSONANCE_PARAMS_STATE.firstOrderDissonance,
    secondOrderDissonance: parsed?.secondOrderDissonance ?? {
      ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      magnitude:
        record.secondOrderBeatingContribution ??
        DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude,
    },
    thirdOrderDissonance: parsed?.thirdOrderDissonance ?? {
      ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      magnitude:
        record.thirdOrderBeatingContribution ??
        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude,
    },
    phantomHarmonicsNumber:
      record.phantomHarmonicsNumber ??
      DEFAULT_DISSONANCE_PARAMS_STATE.phantomHarmonicsNumber,
  }
}
