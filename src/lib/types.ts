import { type StaticImageData } from 'next/image'
import { type InstaQLEntity } from '@instantdb/react'
import { type AppSchema } from '../instant.schema'

export type IntervalDissonanceScore = InstaQLEntity<
  AppSchema,
  'intervalDissonanceScores'
>

export type UserSettings = InstaQLEntity<AppSchema, 'userSettings'>

export type BeatingAnalysisSettings = InstaQLEntity<
  AppSchema,
  'beatingAnalysisSettings'
>

export type DissonanceParamsRecord = InstaQLEntity<AppSchema, 'dissonanceParams'>

export type DissonanceParamsPreset = InstaQLEntity<
  AppSchema,
  'dissonanceParamsPresets'
>

export type BeatingAnalysisPreset = InstaQLEntity<
  AppSchema,
  'beatingAnalysisPresets'
>

export type SensoryDissonanceAnalysisSettings = InstaQLEntity<
  AppSchema,
  'sensoryDissonanceAnalysisSettings'
>

export type SensoryDissonanceAnalysisPreset = InstaQLEntity<
  AppSchema,
  'sensoryDissonanceAnalysisPresets'
>

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
  Microtonalist = 'microtonalist',
  Musician = 'musician',
  NaiveListener = 'naive',
}
