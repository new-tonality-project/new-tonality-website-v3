'use client'

import type { Dispatch, SetStateAction } from 'react'
import { db } from '@/db'
import {
  parseMusicalBackground,
  type SensoryDissonanceAnalysisSettings,
} from '@/lib'
import { useSyncLinkedSettings } from '@/hooks/useSyncLinkedSettings'
import type { SensoryDissonanceAnalysisState } from './types'

export const DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE: SensoryDissonanceAnalysisState =
  {
    showAverage: false,
    showOtherParticipants: true,
    showYourResult: true,
    showExponentialFit: true,
    showPnLResults: false,
    userBackground: undefined,
    xAxisStart: 0,
    xAxisEnd: 1200,
  }

export function toPersistedSensoryDissonanceAnalysisSettings(
  settings: SensoryDissonanceAnalysisState,
) {
  return {
    showAverage: settings.showAverage,
    showOtherParticipants: settings.showOtherParticipants,
    showYourResult: settings.showYourResult,
    showExponentialFit: settings.showExponentialFit,
    showPnLResults: settings.showPnLResults,
    userBackground: settings.userBackground ?? '',
    xAxisStart: settings.xAxisStart,
    xAxisEnd: settings.xAxisEnd,
  }
}

export function mapSensoryDissonanceAnalysisRecordToState(
  record: Partial<
    ReturnType<typeof toPersistedSensoryDissonanceAnalysisSettings>
  >,
): SensoryDissonanceAnalysisState {
  return {
    showAverage:
      record.showAverage ?? DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.showAverage,
    showOtherParticipants:
      record.showOtherParticipants ??
      DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.showOtherParticipants,
    showYourResult:
      record.showYourResult ??
      DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.showYourResult,
    showExponentialFit:
      record.showExponentialFit ??
      DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.showExponentialFit,
    showPnLResults:
      record.showPnLResults ??
      DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.showPnLResults,
    userBackground: parseMusicalBackground(record.userBackground),
    xAxisStart:
      record.xAxisStart ?? DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.xAxisStart,
    xAxisEnd:
      record.xAxisEnd ?? DEFAULT_SENSORY_DISSONANCE_ANALYSIS_STATE.xAxisEnd,
  }
}

function createRecord(
  newId: string,
  userId: string,
  state: SensoryDissonanceAnalysisState,
) {
  const now = Date.now()

  return db.transact(
    db.tx.sensoryDissonanceAnalysisSettings[newId]
      .update({
        ...toPersistedSensoryDissonanceAnalysisSettings(state),
        createdAt: now,
        updatedAt: now,
      })
      .link({
        $users: userId,
      }),
  )
}

export function useSyncSensoryDissonanceAnalysisSettings({
  userId,
  settingsRecord,
  isLoading,
  setSettings,
  getCreateState,
}: {
  userId: string
  settingsRecord: SensoryDissonanceAnalysisSettings | undefined
  isLoading: boolean
  setSettings: Dispatch<SetStateAction<SensoryDissonanceAnalysisState>>
  getCreateState: () => SensoryDissonanceAnalysisState
}) {
  return useSyncLinkedSettings({
    userId,
    isLoading,
    record: settingsRecord,
    setState: setSettings,
    mapRecordToState: mapSensoryDissonanceAnalysisRecordToState,
    getCreateState,
    createRecord,
  })
}

