// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/react'

const dissonanceParamAttrs = {
  phantomHarmonicsNumber: i.number(),
  firstOrderMagnitude: i.number(),
  firstOrderXStar: i.number(),
  firstOrderB1: i.number(),
  firstOrderB2: i.number(),
  firstOrderS1: i.number(),
  firstOrderS2: i.number(),
  firstOrderMagnitudeFrequencyDecay: i.number(),
  firstOrderPhantomNotchDepth: i.number(),
  secondOrderMagnitude: i.number(),
  secondOrderXStar: i.number(),
  secondOrderB1: i.number(),
  secondOrderB2: i.number(),
  secondOrderS1: i.number(),
  secondOrderS2: i.number(),
  secondOrderMagnitudeFrequencyDecay: i.number(),
  secondOrderPhantomNotchDepth: i.number(),
  thirdOrderMagnitude: i.number(),
  thirdOrderXStar: i.number(),
  thirdOrderB1: i.number(),
  thirdOrderB2: i.number(),
  thirdOrderS1: i.number(),
  thirdOrderS2: i.number(),
  thirdOrderMagnitudeFrequencyDecay: i.number(),
  thirdOrderPhantomNotchDepth: i.number(),
}

const beatingAnalysisAttrs = {
  amplitude: i.number(),
  dissonanceCurveMaxCents: i.number(),
  dissonanceCurveMinCents: i.number(),
  harmonicsJson: i.string(),
  intervalCents: i.number(),
  periods: i.number(),
  phaseDegrees: i.number(),
  realHarmonicsNumber: i.number(),
  referenceFrequency: i.number(),
  volume: i.number(),
  showEnvelope: i.boolean(),
  showRms: i.boolean(),
  stretchFactor: i.number(),
}

const sensoryDissonanceAnalysisAttrs = {
  showAverage: i.boolean(),
  showOtherParticipants: i.boolean(),
  showYourResult: i.boolean(),
  showExponentialFit: i.boolean(),
  showPnLResults: i.boolean(),
  userBackground: i.string().optional(),
  xAxisStart: i.number(),
  xAxisEnd: i.number(),
}

const presetMetaAttrs = {
  createdAt: i.number(),
  updatedAt: i.number(),
  name: i.string(),
  isDefault: i.boolean().indexed(),
}

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    dissonanceGraphs: i.entity({
      createdAt: i.date(),
      meanFrequency: i.number().indexed(),
      updatedAt: i.date().optional(),
      userBackground: i.string().indexed().optional(),
    }),
    intervalDissonanceScores: i.entity({
      averageRating: i.number().indexed(),
      correlationCoefficient: i.number(),
      createdAt: i.date(),
      interval: i.number().indexed(),
      isStatisticallyValid: i.boolean().indexed(),
      maxRating: i.number(),
      meanFrequency: i.number().indexed(),
      medianRating: i.number(),
      minRating: i.number(),
      updatedAt: i.date(),
    }),
    userSettings: i.entity({
      createdAt: i.date(),
      isMicrotonalist: i.boolean().indexed(),
      isMusician: i.boolean().indexed(),
      isNaiveListener: i.boolean().indexed(),
      shareDataPrivately: i.boolean().indexed(),
      shareDataPublicly: i.boolean().indexed(),
      updatedAt: i.date(),
      userBackground: i.string().indexed().optional(),
    }),
    beatingAnalysisSettings: i.entity({
      createdAt: i.number(),
      updatedAt: i.number(),
      ...beatingAnalysisAttrs,
    }),
    beatingAnalysisPresets: i.entity({
      ...presetMetaAttrs,
      ...beatingAnalysisAttrs,
    }),
    dissonanceParams: i.entity({
      createdAt: i.number(),
      updatedAt: i.number(),
      ...dissonanceParamAttrs,
    }),
    dissonanceParamsPresets: i.entity({
      ...presetMetaAttrs,
      ...dissonanceParamAttrs,
    }),
    sensoryDissonanceAnalysisSettings: i.entity({
      createdAt: i.number(),
      updatedAt: i.number(),
      ...sensoryDissonanceAnalysisAttrs,
    }),
    sensoryDissonanceAnalysisPresets: i.entity({
      ...presetMetaAttrs,
      ...sensoryDissonanceAnalysisAttrs,
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: '$users',
        has: 'one',
        label: 'linkedPrimaryUser',
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'linkedGuestUsers',
      },
    },
    dissonanceGraphs$users: {
      forward: {
        on: 'dissonanceGraphs',
        has: 'one',
        label: '$users',
        required: true,
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'dissonanceGraphs',
      },
    },
    dissonanceGraphsIntervalDissonanceScores: {
      forward: {
        on: 'dissonanceGraphs',
        has: 'many',
        label: 'intervalDissonanceScores',
      },
      reverse: {
        on: 'intervalDissonanceScores',
        has: 'one',
        label: 'dissonanceGraphs',
      },
    },
    intervalDissonanceScores$users: {
      forward: {
        on: 'intervalDissonanceScores',
        has: 'one',
        label: '$users',
        required: true,
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'many',
        label: 'intervalDissonanceScores',
      },
    },
    userSettings$users: {
      forward: {
        on: 'userSettings',
        has: 'one',
        label: '$users',
        required: true,
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'one',
        label: 'userSettings',
      },
    },
    beatingAnalysisSettings$users: {
      forward: {
        on: 'beatingAnalysisSettings',
        has: 'one',
        label: '$users',
        required: true,
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'one',
        label: 'beatingAnalysisSettings',
      },
    },
    dissonanceParams$users: {
      forward: {
        on: 'dissonanceParams',
        has: 'one',
        label: '$users',
        required: true,
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'one',
        label: 'dissonanceParams',
      },
    },
    sensoryDissonanceAnalysisSettings$users: {
      forward: {
        on: 'sensoryDissonanceAnalysisSettings',
        has: 'one',
        label: '$users',
        required: true,
        onDelete: 'cascade',
      },
      reverse: {
        on: '$users',
        has: 'one',
        label: 'sensoryDissonanceAnalysisSettings',
      },
    },
  },
  rooms: {},
})

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
