'use client'

import type { SurveyIntervalScore } from '@/classes'
import { db } from '@/db'
import { MusicalBackground } from '@/lib'
import { id } from '@instantdb/react'

type SubmitSurveyArgs = {
  scores: SurveyIntervalScore[]
  shareDataPrivately: boolean
  shareDataPublicly: boolean
  musicalBackground: MusicalBackground
  meanFrequency: number
  userId: string
}

async function updateUserSettings(args: {
  userId: string
  musicalBackground: MusicalBackground
  shareDataPrivately: boolean
  shareDataPublicly: boolean
}) {
  const userSettings = await db.queryOnce({
    userSettings: {
      $: {
        where: {
          $users: args.userId,
        },
      },
    },
  })

  const existingUserSettingsId = userSettings.data.userSettings[0]?.id
  const now = Date.now()

  await db.transact(
    db.tx.userSettings[existingUserSettingsId ?? id()]
      .update({
        isMicrotonalist:
          args.musicalBackground === MusicalBackground.Microtonalist,
        isMusician: args.musicalBackground === MusicalBackground.Musician,
        isNaiveListener:
          args.musicalBackground === MusicalBackground.NaiveListener,
        userBackground: args.musicalBackground,
        shareDataPrivately: args.shareDataPrivately,
        shareDataPublicly: args.shareDataPublicly,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        $users: args.userId,
      }),
  )
}

async function createDissonanceGraph(args: {
  userId: string
  musicalBackground: MusicalBackground
  meanFrequency: number
}): Promise<string> {
  const dissonanceGraphId = id()
  const now = Date.now()

  await db.transact(
    db.tx.dissonanceGraphs[dissonanceGraphId]
      .create({
        createdAt: now,
        updatedAt: now,
        userBackground: args.musicalBackground,
        meanFrequency: args.meanFrequency,
      })
      .link({
        $users: args.userId,
      }),
  )

  return dissonanceGraphId
}

async function updateUserDissonanceGraphsBackground(args: {
  userId: string
  musicalBackground: MusicalBackground
}) {
  const usersDissonanceGraphs = await db.queryOnce({
    dissonanceGraphs: {
      $: {
        where: {
          $users: args.userId,
        },
      },
    },
  })

  const graphs = usersDissonanceGraphs.data?.dissonanceGraphs ?? []
  if (graphs.length === 0) return

  const updates = graphs.map((graph) =>
    db.tx.dissonanceGraphs[graph.id].update({
      userBackground: args.musicalBackground,
    }),
  )

  await db.transact(updates)
}

async function createIntervalDissonanceScores(args: {
  scores: SurveyIntervalScore[]
  userId: string
  dissonanceGraphId: string
  meanFrequency: number
}) {
  const now = Date.now()
  const transactions = args.scores.map((score) =>
    db.tx.intervalDissonanceScores[id()]
      .create({
        ...score,
        meanFrequency: args.meanFrequency,
        createdAt: now,
        updatedAt: now,
      })
      .link({
        $users: args.userId,
      })
      .link({
        dissonanceGraphs: args.dissonanceGraphId,
      }),
  )

  await db.transact(transactions)
}

export async function submitSurvey(args: SubmitSurveyArgs) {
  await updateUserSettings({
    userId: args.userId,
    musicalBackground: args.musicalBackground,
    shareDataPrivately: args.shareDataPrivately,
    shareDataPublicly: args.shareDataPublicly,
  })

  const dissonanceGraphId = await createDissonanceGraph({
    userId: args.userId,
    musicalBackground: args.musicalBackground,
    meanFrequency: args.meanFrequency,
  })

  await updateUserDissonanceGraphsBackground({
    userId: args.userId,
    musicalBackground: args.musicalBackground,
  })

  await createIntervalDissonanceScores({
    scores: args.scores,
    userId: args.userId,
    dissonanceGraphId,
    meanFrequency: args.meanFrequency,
  })
}
