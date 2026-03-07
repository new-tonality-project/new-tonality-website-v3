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
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .link({
        $users: args.userId,
      }),
  )

  const dissonanceGraphId = id()

  await db.transact(
    db.tx.dissonanceGraphs[dissonanceGraphId]
      .create({
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userBackground: args.musicalBackground,
        meanFrequency: args.meanFrequency,
      })
      .link({
        $users: args.userId,
      }),
  )



  const usersDissonanceGraphs = await db.queryOnce({
    dissonanceGraphs: {
      $: {
        where: {
          $users: args.userId,
        },
      },
    },
  })

  if (usersDissonanceGraphs.data?.dissonanceGraphs.length !== 0) {
    const transactionBatch1 = []


    for (const graph of usersDissonanceGraphs.data?.dissonanceGraphs) {
      transactionBatch1.push(
        db.tx.dissonanceGraphs[graph.id].update({
          userBackground: args.musicalBackground,
        }),
      )
    }

    await db.transact(transactionBatch1)
  }

  const transactionBatch = []

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
        })
        .link({
          dissonanceGraphs: dissonanceGraphId,
        }),
    )
  }

  await db.transact(transactionBatch)
}
