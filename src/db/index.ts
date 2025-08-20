import { init } from '@instantdb/react'
import { init as adminInit } from '@instantdb/admin'
import schema from './schema'

const appId = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID
const adminToken = process.env.NEXT_PUBLIC_INSTANT_APP_ADMIN_TOKEN

if (!appId) {
  throw new Error('Missing NEXT_PUBLIC_INSTANTDB_APP_ID in your .env file')
}

if (!adminToken) {
  throw new Error('Missing NEXT_PUBLIC_INSTANT_APP_ADMIN_TOKEN in your .env file')
}

export const db = init({ appId, schema })
export const adminDb = adminInit({ appId, adminToken, schema })

export * from './types'
