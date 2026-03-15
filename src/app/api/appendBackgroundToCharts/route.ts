import { adminDb } from '@/db'
import { MusicalBackground, type UserSettings } from '@/lib'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

function getMusicalBackground(userSetting: UserSettings) {
  if (userSetting.isMicrotonalist) return MusicalBackground.Microtonalist
  if (userSetting.isMusician) return MusicalBackground.Musician
  if (userSetting.isNaiveListener) return MusicalBackground.NaiveListener
  return undefined
}

export async function POST() {
  const h = (await headers()).get('Authorization')

  if (h !== `Bearer ${process.env.API_ACCESS_TOKEN}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userSettings } = await adminDb.query({
    userSettings: {
      $users: {
        $: {
          fields: ['id'],
        },
      },
    },
  })

  for (const userSetting of userSettings) {
    const userId = userSetting.$users?.id
    if (!userId) continue

    const userBackground =
      getMusicalBackground(userSetting) || MusicalBackground.NaiveListener

    const { dissonanceGraphs } = await adminDb.query({
      dissonanceGraphs: {
        $: {
          where: {
            $users: userId,
          },
        },
      },
    })

    await adminDb.transact([
      adminDb.tx.userSettings[userSetting.id].update({
        userBackground,
      }),
      ...dissonanceGraphs.map((graph) =>
        adminDb.tx.dissonanceGraphs[graph.id].update({
          userBackground,
        }),
      ),
    ])
  }

  return NextResponse.json({ success: true })
}
