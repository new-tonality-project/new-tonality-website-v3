'use client'

import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { id } from '@instantdb/react'
import { db } from '@/db'
import type { BeatingAnalysisSettings } from '@/lib'
import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import type { DissonanceCurveSettings } from '@/components/DissonanceCurveControls'
import {
  cloneHarmonics,
  createDefaultHarmonicSeries,
  DEFAULT_SPECTRUM_HARMONICS,
  DEFAULT_STRETCH_FACTOR,
  parseHarmonicsJson,
  serializeHarmonicsJson,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import {
  DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  DEFAULT_PERIODS,
  DEFAULT_PHASE_DEGREES,
  DEFAULT_REAL_HARMONICS_NUMBER,
  DEFAULT_REFERENCE_FREQUENCY,
} from '../utils'

export type { SpectrumHarmonic }

export type BeatingAnalysisState = {
  referenceFrequency: number
  periods: number
  intervalCents: number
  amplitude: number
  phaseDegrees: number
  harmonics: SpectrumHarmonic[]
  realHarmonicsNumber: number
  stretchFactor: number
  firstOrderDissonance: DissonanceCurveSettings['firstOrderDissonance']
  secondOrderDissonance: DissonanceCurveSettings['secondOrderDissonance']
  thirdOrderDissonance: DissonanceCurveSettings['thirdOrderDissonance']
  phantomHarmonicsNumber: number
  dissonanceCurveMinCents: number
  dissonanceCurveMaxCents: number
  showEnvelope: boolean
  showRms: boolean
}

export const DEFAULT_BEATING_ANALYSIS_STATE: BeatingAnalysisState = {
  referenceFrequency: DEFAULT_REFERENCE_FREQUENCY,
  periods: DEFAULT_PERIODS,
  intervalCents: 702,
  amplitude: 1,
  phaseDegrees: DEFAULT_PHASE_DEGREES,
  harmonics: cloneHarmonics(DEFAULT_SPECTRUM_HARMONICS),
  realHarmonicsNumber: DEFAULT_REAL_HARMONICS_NUMBER,
  stretchFactor: DEFAULT_STRETCH_FACTOR,
  firstOrderDissonance: { ...DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS },
  secondOrderDissonance: { ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS },
  thirdOrderDissonance: { ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS },
  phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
  dissonanceCurveMinCents: DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  dissonanceCurveMaxCents: DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  showEnvelope: true,
  showRms: false,
}

function parseDissonanceParamsJson(value: string | undefined | null) {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value) as Partial<
      Pick<
        BeatingAnalysisState,
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

export function toPersistedBeatingAnalysisSettings(
  settings: BeatingAnalysisState,
) {
  const {
    harmonics,
    firstOrderDissonance,
    secondOrderDissonance,
    thirdOrderDissonance,
    ...rest
  } = settings

  return {
    ...rest,
    harmonicsJson: serializeHarmonicsJson(harmonics),
    dissonanceParamsJson: JSON.stringify({
      firstOrderDissonance,
      secondOrderDissonance,
      thirdOrderDissonance,
    }),
    secondOrderBeatingContribution: secondOrderDissonance.magnitude ?? 0,
    thirdOrderBeatingContribution: thirdOrderDissonance.magnitude ?? 0,
  }
}

function mapRecordToState(record: BeatingAnalysisSettings): BeatingAnalysisState {
  const realHarmonicsNumber =
    record.realHarmonicsNumber ??
    DEFAULT_BEATING_ANALYSIS_STATE.realHarmonicsNumber
  const harmonics =
    parseHarmonicsJson(record.harmonicsJson) ??
    createDefaultHarmonicSeries(realHarmonicsNumber)
  const parsedDissonance = parseDissonanceParamsJson(record.dissonanceParamsJson)

  return {
    referenceFrequency:
      record.referenceFrequency ?? DEFAULT_BEATING_ANALYSIS_STATE.referenceFrequency,
    periods: record.periods ?? DEFAULT_BEATING_ANALYSIS_STATE.periods,
    intervalCents:
      record.intervalCents ?? DEFAULT_BEATING_ANALYSIS_STATE.intervalCents,
    amplitude: Math.min(
      1,
      Math.max(
        0,
        record.amplitude ?? DEFAULT_BEATING_ANALYSIS_STATE.amplitude,
      ),
    ),
    phaseDegrees:
      record.phaseDegrees ?? DEFAULT_BEATING_ANALYSIS_STATE.phaseDegrees,
    harmonics,
    realHarmonicsNumber: harmonics.length,
    stretchFactor: record.stretchFactor ?? DEFAULT_STRETCH_FACTOR,
    firstOrderDissonance:
      parsedDissonance?.firstOrderDissonance ??
      DEFAULT_BEATING_ANALYSIS_STATE.firstOrderDissonance,
    secondOrderDissonance: parsedDissonance?.secondOrderDissonance ?? {
      ...DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
      magnitude:
        record.secondOrderBeatingContribution ??
        DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude,
    },
    thirdOrderDissonance: parsedDissonance?.thirdOrderDissonance ?? {
      ...DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
      magnitude:
        record.thirdOrderBeatingContribution ??
        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude,
    },
    phantomHarmonicsNumber:
      record.phantomHarmonicsNumber ??
      DEFAULT_BEATING_ANALYSIS_STATE.phantomHarmonicsNumber,
    dissonanceCurveMinCents:
      record.dissonanceCurveMinCents ??
      DEFAULT_BEATING_ANALYSIS_STATE.dissonanceCurveMinCents,
    dissonanceCurveMaxCents:
      record.dissonanceCurveMaxCents ??
      DEFAULT_BEATING_ANALYSIS_STATE.dissonanceCurveMaxCents,
    showEnvelope:
      record.showEnvelope ?? DEFAULT_BEATING_ANALYSIS_STATE.showEnvelope,
    showRms: record.showRms ?? DEFAULT_BEATING_ANALYSIS_STATE.showRms,
  }
}

export function useSyncBeatingAnalysisSettings({
  userId,
  settingsRecord,
  isLoading,
  setSettings,
}: {
  userId: string
  settingsRecord: BeatingAnalysisSettings | undefined
  isLoading: boolean
  setSettings: Dispatch<SetStateAction<BeatingAnalysisState>>
}) {
  const settingsIdRef = useRef<string | null>(null)
  const hasSyncedFromServer = useRef(false)
  const isCreating = useRef(false)

  useEffect(() => {
    if (isLoading) return

    if (settingsRecord) {
      settingsIdRef.current = settingsRecord.id

      if (!hasSyncedFromServer.current) {
        setSettings(mapRecordToState(settingsRecord))
        hasSyncedFromServer.current = true
      }

      return
    }

    if (isCreating.current) return

    isCreating.current = true
    const newId = id()
    settingsIdRef.current = newId
    const now = Date.now()

    const persisted = toPersistedBeatingAnalysisSettings(
      DEFAULT_BEATING_ANALYSIS_STATE,
    )

    db.transact(
      db.tx.beatingAnalysisSettings[newId]
        .update({
          ...persisted,
          createdAt: now,
          updatedAt: now,
        })
        .link({
          $users: userId,
        }),
    ).finally(() => {
      isCreating.current = false
    })
  }, [isLoading, settingsRecord, userId, setSettings])

  return settingsIdRef
}
