'use client'

import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react'
import { id } from '@instantdb/react'
import { db } from '@/db'
import type { BeatingAnalysisSettings } from '@/lib'
import {
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import {
  cloneHarmonics,
  createDefaultHarmonicSeries,
  DEFAULT_SPECTRUM_HARMONICS,
  getMaxHarmonicRatioAcross,
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
  referenceHarmonics: SpectrumHarmonic[]
  intervalHarmonics: SpectrumHarmonic[]
  spectraLinked: boolean
  realHarmonicsNumber: number
  phantomHarmonicsNumber: number
  secondOrderBeatingContribution: number
  thirdOrderBeatingContribution: number
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
  referenceHarmonics: cloneHarmonics(DEFAULT_SPECTRUM_HARMONICS),
  intervalHarmonics: cloneHarmonics(DEFAULT_SPECTRUM_HARMONICS),
  spectraLinked: true,
  realHarmonicsNumber: DEFAULT_REAL_HARMONICS_NUMBER,
  phantomHarmonicsNumber: DEFAULT_PHANTOM_HARMONICS_NUMBER,
  secondOrderBeatingContribution:
    DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude,
  thirdOrderBeatingContribution:
    DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude,
  dissonanceCurveMinCents: DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  dissonanceCurveMaxCents: DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  showEnvelope: true,
  showRms: false,
}

function mapRecordToState(record: BeatingAnalysisSettings): BeatingAnalysisState {
  const realHarmonicsNumber =
    record.realHarmonicsNumber ??
    DEFAULT_BEATING_ANALYSIS_STATE.realHarmonicsNumber
  const referenceHarmonics =
    parseHarmonicsJson(record.harmonicsJson) ??
    createDefaultHarmonicSeries(realHarmonicsNumber)
  const intervalHarmonics =
    parseHarmonicsJson(record.intervalHarmonicsJson) ??
    cloneHarmonics(referenceHarmonics)
  const spectraLinked = record.spectraLinked ?? true

  return {
    referenceFrequency:
      record.referenceFrequency ?? DEFAULT_BEATING_ANALYSIS_STATE.referenceFrequency,
    periods: record.periods ?? DEFAULT_BEATING_ANALYSIS_STATE.periods,
    intervalCents:
      record.intervalCents ?? DEFAULT_BEATING_ANALYSIS_STATE.intervalCents,
    amplitude: record.amplitude ?? DEFAULT_BEATING_ANALYSIS_STATE.amplitude,
    phaseDegrees:
      record.phaseDegrees ?? DEFAULT_BEATING_ANALYSIS_STATE.phaseDegrees,
    referenceHarmonics,
    intervalHarmonics: spectraLinked
      ? cloneHarmonics(referenceHarmonics)
      : intervalHarmonics,
    spectraLinked,
    realHarmonicsNumber: getMaxHarmonicRatioAcross(
      referenceHarmonics,
      spectraLinked ? referenceHarmonics : intervalHarmonics,
    ),
    phantomHarmonicsNumber:
      record.phantomHarmonicsNumber ??
      DEFAULT_BEATING_ANALYSIS_STATE.phantomHarmonicsNumber,
    secondOrderBeatingContribution:
      record.secondOrderBeatingContribution ??
      DEFAULT_BEATING_ANALYSIS_STATE.secondOrderBeatingContribution,
    thirdOrderBeatingContribution:
      record.thirdOrderBeatingContribution ??
      DEFAULT_BEATING_ANALYSIS_STATE.thirdOrderBeatingContribution,
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

    const {
      referenceHarmonics,
      intervalHarmonics,
      ...defaults
    } = DEFAULT_BEATING_ANALYSIS_STATE

    db.transact(
      db.tx.beatingAnalysisSettings[newId]
        .update({
          ...defaults,
          harmonicsJson: serializeHarmonicsJson(referenceHarmonics),
          intervalHarmonicsJson: serializeHarmonicsJson(intervalHarmonics),
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
