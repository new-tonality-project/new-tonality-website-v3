import { init } from '@instantdb/react'
import schema from '../instant.schema'
import {init as adminInit} from '@instantdb/admin';

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID
const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN as string

if (!appId) {
  throw new Error('Missing NEXT_PUBLIC_INSTANT_APP_ID in your .env file')
}

export const db = init({ appId, schema })
export const adminDb = adminInit({ appId, schema, adminToken, })
