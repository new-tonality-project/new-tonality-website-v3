import type { PlotPoint } from '@/lib'
import { centsToRatio } from 'sethares-dissonance'


export class SurveyIntervals {
  private _data: Map<number, number[]> = new Map()

  constructor() {
    this.addRandomIntervals(3, 0, 200)
    this.addRandomIntervals(4, 200, 600)
    this.addRandomIntervals(4, 600, 1000)
    this.addRandomIntervals(3, 1000, 1200)
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

  public getFrequencies(medianFrequency: number) {
    return this.values.map((interval) => {
      const ratio = centsToRatio(interval)
      const f_1 = medianFrequency / Math.sqrt(1 + ratio)
      const f_2 = ratio * f_1
      return { interval, frequencies: [f_1, f_2] as [number, number] }
    })
  }

  private addRandomIntervals(length: number, min: number, max: number) {
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
