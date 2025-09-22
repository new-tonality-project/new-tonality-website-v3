import type { PlotPoint } from '@/lib'
import { centsToRatio } from 'sethares-dissonance'

export class SurveyIntervals {
  private _data: Map<number, number[]> = new Map()
  private _shuffled: number[] = []

  constructor() {
    this.setRandomIntervalsBasedOn12TET()

    this._shuffled = this.getShuffled()
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

  public getShuffled() {
    const lastEl = this._shuffled.at(-1)

    if (!lastEl) {
      this._shuffled = this.values.toSorted(() => Math.random() - 0.5)
      return this._shuffled
    }

    this._shuffled = this.values
      .filter((el) => el !== lastEl)
      .toSorted(() => Math.random() - 0.5)

    this._shuffled.splice(Math.floor(this._shuffled.length / 2), 0, lastEl)

    return this._shuffled
  }

  public getFrequencies(medianFrequency: number) {
    return this.values.map((interval) => {
      const ratio = centsToRatio(interval)
      const f_1 = medianFrequency / Math.sqrt(1 + ratio)
      const f_2 = ratio * f_1
      return { interval, frequencies: [f_1, f_2] as [number, number] }
    })
  }

  public setRandomIntervalsBasedOn12TET() {
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

  private addRandomIntervalsInARange(length: number, min: number, max: number) {
    if (min < 0 || max < 0 || length < 0)
      throw new Error('Arguments should be greater than zero')
    if (min >= max) throw new Error('Argument max should be greater than min')

    const MIN_DELTA = (max - min) / (2 * length)

    let count = 0
    let iteration = 1

    while (count < length) {
      if (iteration > 1000) throw new Error('Infinite loop')
      iteration++

      const interval = min + Math.floor(Math.random() * (max - min))
      if (this.delta(interval) < MIN_DELTA) continue

      this.set(interval, [])
      count++
    }

    return this
  }

  private set(key: number, value: number[]) {
    return this._data.set(key, value)
  }

  private delta(interval: number) {
    let delta = Infinity

    for (const num of this.values) {
      const newDelta = Math.abs(num - interval)
      if (newDelta < delta) delta = newDelta
    }

    return delta
  }
}
