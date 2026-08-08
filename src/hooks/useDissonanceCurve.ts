'use client'

import { useMemo } from 'react'
import { DissonanceCurve, type DissonanceCurveOptions } from 'sethares-dissonance'

type ReadOnlyDissonanceCurve = Omit<
  DissonanceCurve,
  "recalculate"
>;

function createReadOnlyWrapper(curve: DissonanceCurve) {
  return {
    get maxDissonance() {
      return curve.maxDissonance
    },
    plot: () => curve.plot(),
    plotCents: () => curve.plotCents(),
  } satisfies Partial<ReadOnlyDissonanceCurve>
}

export type UseDissonanceCurveOptions = DissonanceCurveOptions & { normalize?: { min: number, max: number } }

/**
 * React hook that creates and maintains a DissonanceCurve instance.
 * Recalculates when options change and returns a new wrapper object (new reference)
 * so consumers re-render correctly.
 *
 * @param options - DissonanceCurveOptions. Memoize with useMemo when options
 * contain objects (e.g. Spectrum) to avoid recalculating on every render.
 * @returns ReadOnlyDissonanceCurve - wrapper delegating to the curve (new ref on each update)
 */
export function useDissonanceCurve(
  options: UseDissonanceCurveOptions
) {
  return useMemo(() => {
    const curve = new DissonanceCurve(options)
    if (options.normalize) curve.normalize(options.normalize.min, options.normalize.max)
    return createReadOnlyWrapper(curve)
  }, [options])
}
