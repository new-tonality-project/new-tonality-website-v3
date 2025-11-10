export function getRandomIntervals(length: number, min: number, max: number) {
  if (min < 0 || max < 0 || length < 0)
    throw new Error('Arguments should be greater than zero')
  if (min >= max) throw new Error('Argument max should be greater than min')

  const result: number[] = []

  for (let i = 0; i < length; i++) {
    const interval = min + Math.random() / (max - min)
    result.push(interval)
  }

  return result
}

const CENTS_0 = 1
const CENTS_200 = 1.122462
const CENTS_600 = 1.414214
const CENTS_1000 = 1.781797
const CENTS_1200 = 2

export function getSurveyIntervals() {
  const sm = getRandomIntervals(3, CENTS_0, CENTS_200)
  const md = getRandomIntervals(4, CENTS_200, CENTS_600)
  const lg = getRandomIntervals(4, CENTS_600, CENTS_1000)
  const xl = getRandomIntervals(3, CENTS_1000, CENTS_1200)

  return [...sm, ...md, ...lg, ...xl]
}
