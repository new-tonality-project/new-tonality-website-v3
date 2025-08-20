import { adminDb, db, SetharesDissonancePreset } from '@/db'
import { debounceTransaction } from '@/lib'
import { id } from '@instantdb/admin'

export const FALLBACK_PRESET: SetharesDissonancePreset = {
  id: '',
  userId: '',
  name: '',
  numberOfPartials: 6,
  createdAt: 0,
  updatedAt: 0,
}

export async function getInitialPreset(userId: string | null) {
  if (!userId) return

  let result = await getInitPreset(userId)

  if (result) return result

  await initializePreset(userId)

  return await getInitPreset(userId)
}

export async function getInitPreset(userId: string) {
  const result = await adminDb.query({
    setharesDissonancePresets: {
      $: {
        where: {
          userId,
          name: 'init',
        },
      },
    },
  })

  if (result.setharesDissonancePresets.length === 0) return undefined

  return result.setharesDissonancePresets[0]
}

export async function initializePreset(userId: string) {
  return adminDb.transact(
    adminDb.tx.setharesDissonancePresets[id()].create({
      userId,
      name: 'init',
      numberOfPartials: FALLBACK_PRESET.numberOfPartials,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }),
  )
}

export const updatePreset = debounceTransaction(
  (id: string, numberOfPartials: number) => {
    db.transact(
      db.tx.setharesDissonancePresets[id].update({
        numberOfPartials,
        updatedAt: Date.now(),
      }),
    )
  }
)
