import type { PlotPoint } from '@/lib'
import { centsToRatio } from 'sethares-dissonance'

export class SurveyIntervals {
  private _data: Map<number, number[]> = new Map()
  private _surveyOrder: number[]

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

  get valuesAsRatios() {
    return this.values.map((val) => centsToRatio(val))
  }

  get plotData() {
    return this.values.map((interval) => ({
      x: interval,
      y: 0.5,
    })) as PlotPoint[]
  }

  public rateInterval({ interval, rating }: { interval: number; rating: number }) {
    const currentRating = this._data.get(interval)

    if (!currentRating) return

    this._data.set(interval, [...currentRating, rating])
  }

  private setRandomIntervalsBasedOn12TET() {
    const MIN_DELTA = 50
    let lastInterval = Infinity

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

    return this
  }

  private getSurveyOrder() {
    const result: number[] = []
    const numberOfIterations = 3

    for (let i = 0; i < numberOfIterations; i++) {
      const lastEl = this._surveyOrder?.at(-1)
      const shuffledIntervals = this.getShuffledIntervals(lastEl)

      result.push(...shuffledIntervals)
    }

    return result
  }

  private getShuffledIntervals(lastEl?: number) {
    if (!lastEl) {
      return this.values.toSorted(() => Math.random() - 0.5)
    }

    return this.values
      .filter((el) => el !== lastEl)
      .toSorted(() => Math.random() - 0.5)
      .splice(Math.floor(this.values.length / 2), 0, lastEl)
  }

  private set(key: number, value: number[]) {
    return this._data.set(key, value)
  }
}
