// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/react'

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
    setharesDissonancePresets: i.entity({
      createdAt: i.number().optional(),
      name: i.string().optional(),
      numberOfPartials: i.number().optional(),
      updatedAt: i.number().optional(),
      userId: i.string(),
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
      amplitude: i.number(),
      dissonanceCurveMaxCents: i.number().optional(),
      dissonanceCurveMinCents: i.number().optional(),
      harmonicsJson: i.string().optional(),
      intervalHarmonicsJson: i.string().optional(),
      intervalCents: i.number(),
      periods: i.number(),
      phaseDegrees: i.number(),
      realHarmonicsNumber: i.number().optional(),
      referenceFrequency: i.number(),
      volume: i.number().optional(),
      showEnvelope: i.boolean(),
      showRms: i.boolean(),
      stretchFactor: i.number().optional(),
      // Legacy fields kept optional so existing rows can seed dissonanceParams.
      dissonanceParamsJson: i.string().optional(),
      phantomHarmonicsNumber: i.number().optional(),
      secondOrderBeatingContribution: i.number().optional(),
      thirdOrderBeatingContribution: i.number().optional(),
    }),
    dissonanceParams: i.entity({
      createdAt: i.number(),
      updatedAt: i.number(),
      paramsJson: i.string(),
      phantomHarmonicsNumber: i.number(),
    }),
    sensoryDissonanceAnalysisSettings: i.entity({
      createdAt: i.number(),
      updatedAt: i.number(),
      showAverage: i.boolean(),
      showOtherParticipants: i.boolean(),
      showYourResult: i.boolean(),
      showExponentialFit: i.boolean(),
      showPnLResults: i.boolean(),
      userBackground: i.string().optional(),
      xAxisStart: i.number(),
      xAxisEnd: i.number(),
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
