'use client'

import type { SurveyIntervalScore } from '@/classes'
import { db } from '@/db'
import { MusicalBackground } from '@/lib'
import { id } from '@instantdb/react'

export async function submitSurvey(args: {
  scores: SurveyIntervalScore[]
  shareDataPrivately: boolean
  shareDataPublicly: boolean
  musicalBackground: MusicalBackground
  meanFrequency: number
  userId: string
}) {
  console.log('args.userId', args.userId)

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
  console.log('existingUserSettingsId', existingUserSettingsId)

  await db.transact(
    db.tx.userSettings[existingUserSettingsId ?? id()]
      .update({
        isMicrotonalist:
          args.musicalBackground === MusicalBackground.Microtonalist,
        isMusician: args.musicalBackground === MusicalBackground.Musician,
        isNaiveListener:
          args.musicalBackground === MusicalBackground.NaiveListener,
        shareDataPrivately: args.shareDataPrivately,
        shareDataPublicly: args.shareDataPublicly,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .link({
        $users: args.userId,
      }),
  )

  const transactionBatch = []
  console.log('args.scores', args.scores)

  for (const score of args.scores) {
    transactionBatch.push(
      db.tx.intervalDissonanceScores[id()]
        .create({
          ...score,
          meanFrequency: args.meanFrequency,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        })
        .link({
          $users: args.userId,
        }),
    )
  }

  await db.transact(transactionBatch)
}
