'use client'

import { useMemo, useState } from 'react'
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
    plotCents: () => curve.plotCents(),
  } satisfies Partial<ReadOnlyDissonanceCurve>
}

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
  options: DissonanceCurveOptions
) {
  return useMemo(() => {
    return createReadOnlyWrapper(new DissonanceCurve(options))
  }, [options])
}
