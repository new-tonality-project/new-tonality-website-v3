import { type StaticImageData } from 'next/image'
import { type InstaQLEntity } from '@instantdb/react'
import { type AppSchema } from '../instant.schema'

export type SetharesDissonancePreset = InstaQLEntity<
  AppSchema,
  'setharesDissonancePresets'
>

export type IntervalDissonanceScore = InstaQLEntity<
  AppSchema,
  'intervalDissonanceScores'
>

export type UserSettings = InstaQLEntity<AppSchema, 'userSettings'>

export type BasicLink = { label: string; href: string }

export type Article = {
  title: string
  description: string
  author: string
  date: string
}

export type Tool = {
  name: string
  description: string
  logo: StaticImageData
  link: BasicLink
}

export type ArticleWithSlug = Article & {
  slug: string
}

export type PlotPoint = {
  x: number
  y: number
}

export enum MusicalBackground {
  Microtonalist = 1,
  Musician,
  NaiveListener,
}
