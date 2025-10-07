'use server'

import type { DissonanceRating, SurveyIntervals } from '@/classes'
import { adminDb } from '@/db'
import { id } from '@instantdb/admin'


export async function submitSurvey(args: {
  ratings: DissonanceRating[]
  shareDataPrivately: boolean
  shareDataPublicly: boolean
  musicalBackground: string
  medianFrequency: number
  userId: string
}) {
  

  await adminDb.transact(
    adminDb.tx.userSettings[id()]
      .create({
        isMicrotonalist: args.musicalBackground === 'microtonalist',
        isMusician: args.musicalBackground === 'musician',
        isNaiveListener: args.musicalBackground === 'naive-listener',
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

  for (const rating of args.ratings) {
    transactionBatch.push(
      adminDb.tx.intervalDissonanceScores[id()].create({
        ...rating,
        isMicrotonalist: args.musicalBackground === 'microtonalist',
        isMusician: args.musicalBackground === 'musician',
        isNaiveListener: args.musicalBackground === 'naive-listener',
        shareDataPrivately: args.shareDataPrivately,
        shareDataPublicly: args.shareDataPublicly,
        medianFrequency: args.medianFrequency,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).link({
        $users: args.userId,
      }),
    )
  }

  await adminDb.transact(transactionBatch)
}
