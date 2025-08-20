import { i } from '@instantdb/react'

export const _schema = i.schema({
  entities: {
    setharesDissonancePresets: i.entity({
      userId: i.string(),
      name: i.string(),
      numberOfPartials: i.number(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
  },
})

type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
