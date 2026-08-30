'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { db } from '@/db'
import type { BeatingAnalysisSettings } from '@/lib'
import {
  cloneHarmonics,
  createDefaultHarmonicSeries,
  DEFAULT_SPECTRUM_HARMONICS,
  DEFAULT_STRETCH_FACTOR,
  parseHarmonicsJson,
  serializeHarmonicsJson,
  type SpectrumHarmonic,
} from '@/lib/spectrum'
import { useSyncLinkedSettings } from '@/hooks/useSyncLinkedSettings'
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
  dissonanceCurveMinCents: DEFAULT_DISSONANCE_CURVE_MIN_CENTS,
  dissonanceCurveMaxCents: DEFAULT_DISSONANCE_CURVE_MAX_CENTS,
  showEnvelope: true,
  showRms: false,
}

export function toPersistedBeatingAnalysisSettings(
  settings: BeatingAnalysisState,
) {
  const { harmonics, ...rest } = settings

  return {
    ...rest,
    harmonicsJson: serializeHarmonicsJson(harmonics),
  }
}

function mapRecordToState(record: BeatingAnalysisSettings): BeatingAnalysisState {
  const realHarmonicsNumber =
    record.realHarmonicsNumber ??
    DEFAULT_BEATING_ANALYSIS_STATE.realHarmonicsNumber
  const harmonics =
    parseHarmonicsJson(record.harmonicsJson) ??
    createDefaultHarmonicSeries(realHarmonicsNumber)

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

const getCreateState = () => DEFAULT_BEATING_ANALYSIS_STATE

function createRecord(
  newId: string,
  userId: string,
  state: BeatingAnalysisState,
) {
  const now = Date.now()

  return db.transact(
    db.tx.beatingAnalysisSettings[newId]
      .update({
        ...toPersistedBeatingAnalysisSettings(state),
        createdAt: now,
        updatedAt: now,
      })
      .link({
        $users: userId,
      }),
  )
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
  return useSyncLinkedSettings({
    userId,
    isLoading,
    record: settingsRecord,
    setState: setSettings,
    mapRecordToState,
    getCreateState,
    createRecord,
  })
}
