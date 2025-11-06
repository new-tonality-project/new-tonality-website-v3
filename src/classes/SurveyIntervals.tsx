import type { IntervalDissonanceScore, PlotPoint } from '@/lib'
import { centsToRatio } from 'sethares-dissonance'

export type SurveyIntervalScore = Omit<
  IntervalDissonanceScore,
  'createdAt' | 'updatedAt' | 'meanFrequency' | 'id'
>
export class SurveyIntervals {
  private _data: Map<number, number[]> = new Map()
  private _surveyOrder: number[]
  private readonly MAX_INTERVAL_DIFFERENCE = 200

  constructor() {
    this.setRandomIntervalsBasedOn12TET()

    this._surveyOrder = this.getSurveyOrder()
  }

  get surveyOrder() {
    return this._surveyOrder
  }

  get values() {
    return Array.from(this._data.keys()).sort((a, b) => a - b)
  }

  get scores(): SurveyIntervalScore[] {
    return Array.from(
      this._data.entries().map(([interval, ratings]) => ({
        interval,
        ...this.getRatingStats(ratings),
        correlationCoefficient: this.correlationCoefficient,
        isStatisticallyValid: this.isStatisticallyValid,
      })),
    )
  }

  private getRatingStats(ratings: number[]) {
    const sorted = ratings.toSorted((a, b) => a - b)

    return {
      minRating: sorted[0],
      maxRating: sorted[2],
      medianRating: sorted[1],
      averageRating:
        ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length,
    }
  }

  get ratingSeries() {
    return [
      Array.from(this._data.values().map((rating) => rating[0])),
      Array.from(this._data.values().map((rating) => rating[1])),
      Array.from(this._data.values().map((rating) => rating[2])),
    ]
  }

  get correlationCoefficient() {
    const [series1, series2, series3] = this.ratingSeries

    const correlation1 = this.correlation(series1, series2)
    const correlation2 = this.correlation(series1, series3)
    const correlation3 = this.correlation(series2, series3)

    return (correlation1 + correlation2 + correlation3) / 3
  }

  get isStatisticallyValid() {
    return this.correlationCoefficient > 0.5
  }

  private correlation(series1: number[], series2: number[]) {
    const mean1 =
      series1.reduce((acc, rating) => acc + rating, 0) / series1.length
    const mean2 =
      series2.reduce((acc, rating) => acc + rating, 0) / series2.length
    const covariance = series1.reduce(
      (acc, rating, index) => acc + (rating - mean1) * (series2[index] - mean2),
      0,
    )
    const std1 = series1.reduce(
      (acc, rating) => acc + Math.pow(rating - mean1, 2),
      0,
    )
    const std2 = series2.reduce(
      (acc, rating) => acc + Math.pow(rating - mean2, 2),
      0,
    )

    const denominator = Math.sqrt(std1 * std2)

    return denominator === 0 ? 0 : covariance / denominator
  }

  get valuesAsRatios() {
    return this.values.map((val) => centsToRatio(val))
  }

  get plotData() {
    return this.values.map((interval) => ({
      x: interval,
      y: 0.5,
    })) as PlotPoint[]
  }

  public rateInterval({
    interval,
    rating,
  }: {
    interval: number
    rating: number
  }) {
    const currentRating = this._data.get(interval)

    if (!currentRating) return

    this._data.set(interval, [...currentRating, rating])
  }

  private setRandomIntervalsBasedOn12TET() {
    const MIN_DELTA = 50
    let lastInterval = Infinity

    this.set(0, [])

    for (let i = 1; i <= 12; i++) {
      const interval12tet = i * 100
      let newInterval
      let iteration = 1

      while (!newInterval || Math.abs(lastInterval - newInterval) < MIN_DELTA) {
        if (iteration > 100) throw new Error('Infinite loop')
        newInterval = interval12tet - Math.floor(Math.random() * 100)
        iteration++
      }

      this.set(newInterval, [])
      lastInterval = newInterval
    }

    this.set(1200, [])

    return this
  }

  public getShuffledBatch(sourceArray: number[]): number[] {
    let shuffledBatch = [...sourceArray].sort(() => Math.random() - 0.5)
    let iterations = 0
    const maxIterations = 1000

    while (
      (this.hasConsecutiveUnisonAndOctave(shuffledBatch) ||
        this.hasTooCloseConsecutiveIntervals(shuffledBatch)) &&
      iterations < maxIterations
    ) {
      shuffledBatch = [...sourceArray].sort(() => Math.random() - 0.5)
      iterations++
    }

    if (iterations >= maxIterations) {
      throw new Error(
        'Failed to find valid batch without consecutive 0/1200 after maximum iterations',
      )
    }

    return shuffledBatch
  }

  private hasConsecutiveUnisonAndOctave(batch: number[]): boolean {
    for (let j = 0; j < batch.length - 1; j++) {
      const current = batch[j]
      const next = batch[j + 1]
      if (
        (current === 0 && next === 1200) ||
        (current === 1200 && next === 0)
      ) {
        return true
      }
    }
    return false
  }

  private hasTooCloseConsecutiveIntervals(batch: number[]): boolean {
    for (let j = 0; j < batch.length - 1; j++) {
      const current = batch[j]
      const next = batch[j + 1]
      if (Math.abs(current - next) < this.MAX_INTERVAL_DIFFERENCE) {
        return true
      }
    }
    return false
  }

  private getSurveyOrder() {
    const allIntervals = this.values
    const evenIndexedIntervals: number[] = []
    const oddIndexedIntervals: number[] = []

    for (let i = 0; i < allIntervals.length; i++) {
      if (i % 2 === 0) {
        evenIndexedIntervals.push(allIntervals[i])
      } else {
        oddIndexedIntervals.push(allIntervals[i])
      }
    }

    const result: number[] = []
    const numberOfBatches = 6

    for (let i = 0; i < numberOfBatches; i++) {
      const isEvenBatch = i % 2 === 0
      const sourceArray = isEvenBatch
        ? evenIndexedIntervals
        : oddIndexedIntervals

      const lastInterval = result.at(-1)

      let shuffledBatch = this.getShuffledBatch(sourceArray)

      if (lastInterval !== undefined) {
        let needsReshuffle = true
        let iterations = 0
        const maxIterations = 1000

        while (needsReshuffle && iterations < maxIterations) {
          const firstInterval = shuffledBatch[0]
          const difference = Math.abs(lastInterval - firstInterval)

          const boundaryViolation =
            (lastInterval === 0 && firstInterval === 1200) ||
            (lastInterval === 1200 && firstInterval === 0) ||
            difference <= this.MAX_INTERVAL_DIFFERENCE

          needsReshuffle = boundaryViolation

          if (needsReshuffle) {
            shuffledBatch = this.getShuffledBatch(sourceArray)
            iterations++
          }
        }

        if (iterations >= maxIterations) {
          throw new Error(
            'Failed to find valid shuffle after maximum iterations',
          )
        }
      }

      result.push(...shuffledBatch)
    }

    return result
  }

  private set(key: number, value: number[]) {
    return this._data.set(key, value)
  }
}
