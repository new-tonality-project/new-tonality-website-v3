import { describe, it, expect } from 'bun:test'
import { SurveyIntervals } from './SurveyIntervals'

describe('SurveyIntervals', () => {
  describe('getSurveyOrder', () => {
    it('should generate survey order with correct number of intervals', () => {
      const surveyIntervals = new SurveyIntervals()
      const order = surveyIntervals.surveyOrder

      // Should have 3 repetitions of each interval
      const uniqueIntervals = surveyIntervals.values
      const expectedLength = uniqueIntervals.length * 3

      expect(order.length).toBe(expectedLength)
    })

    it('should have each interval appear exactly 3 times', () => {
      const surveyIntervals = new SurveyIntervals()
      const order = surveyIntervals.surveyOrder
      const uniqueIntervals = surveyIntervals.values

      for (const interval of uniqueIntervals) {
        const count = order.filter((val) => val === interval).length
        expect(count).toBe(3)
      }
    })

    it('should not have consecutive 0 and 1200 intervals', () => {
      const numberOfIterations = 1000

      for (let iteration = 0; iteration < numberOfIterations; iteration++) {
        const surveyIntervals = new SurveyIntervals()
        const order = surveyIntervals.surveyOrder

        for (let i = 0; i < order.length - 1; i++) {
          const current = order[i]
          const next = order[i + 1]

          // Check that we don't have 0 followed by 1200 or vice versa
          expect(
            !(current === 0 && next === 1200) && !(current === 1200 && next === 0),
          ).toBe(true)
        }
      }
    })

    it('should contain all intervals from values', () => {
      const surveyIntervals = new SurveyIntervals()
      const order = surveyIntervals.surveyOrder
      const uniqueIntervals = surveyIntervals.values

      const orderSet = new Set(order)

      for (const interval of uniqueIntervals) {
        expect(orderSet.has(interval)).toBe(true)
      }
    })

    it('should have consecutive intervals with more than 100 cents difference', () => {
      const numberOfIterations = 1000

      for (let iteration = 0; iteration < numberOfIterations; iteration++) {
        const surveyIntervals = new SurveyIntervals()
        const order = surveyIntervals.surveyOrder

        for (let i = 0; i < order.length - 1; i++) {
          const current = order[i]
          const next = order[i + 1]
          const difference = Math.abs(current - next)

          expect(difference).toBeGreaterThan(99)
        }
      }
    })
  })

  describe('getShuffledBatch', () => {
    it('should generate survey order with correct number of intervals', () => {
      const surveyIntervals = new SurveyIntervals()
      const order = surveyIntervals.getShuffledBatch(surveyIntervals.values)

      expect(order.length).toBe(surveyIntervals.values.length)
    })

    it('should not have consecutive 0 and 1200 intervals', () => {
      const numberOfIterations = 1000

      for (let iteration = 0; iteration < numberOfIterations; iteration++) {
        const surveyIntervals = new SurveyIntervals()
        const order = surveyIntervals.getShuffledBatch(surveyIntervals.values)

        for (let i = 0; i < order.length - 1; i++) {
          const current = order[i]
          const next = order[i + 1]

          // Check that we don't have 0 followed by 1200 or vice versa
          expect(
            !(current === 0 && next === 1200) && !(current === 1200 && next === 0),
          ).toBe(true)
        }
      }
    })

    it('should contain all intervals from values', () => {
      const surveyIntervals = new SurveyIntervals()
      const order = surveyIntervals.getShuffledBatch(surveyIntervals.values)

      const orderSet = new Set(order)

      for (const interval of surveyIntervals.values) {
        expect(orderSet.has(interval)).toBe(true)
      }
    })

    it('should have consecutive intervals with more than 100 cents difference', () => {
      const numberOfIterations = 1000

      for (let iteration = 0; iteration < numberOfIterations; iteration++) {
        const surveyIntervals = new SurveyIntervals()
        const order = surveyIntervals.getShuffledBatch(surveyIntervals.values)

        for (let i = 0; i < order.length - 1; i++) {
          const current = order[i]
          const next = order[i + 1]
          const difference = Math.abs(current - next)

          expect(difference).toBeGreaterThan(99)
        }
      }
    })
  })
})

