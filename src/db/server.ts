import { init } from '@instantdb/admin'
import schema from '../instant.schema'

const appId = process.env.NEXT_PUBLIC_INSTANT_APP_ID
const adminToken = process.env.INSTANT_APP_ADMIN_TOKEN as string

if (!appId) {
  throw new Error('Missing NEXT_PUBLIC_INSTANT_APP_ID in your .env file')
}

export const adminDb = init({ appId, schema, adminToken })
