'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type Highcharts from 'highcharts'
import { AdditiveSynth } from 'new-tonality-web-synth'
import { getIntervalFrequencies } from '@/lib'

export type PlotBounds = {
  left: number
  top: number
  width: number
  height: number
}

const DEFAULT_X_AXIS_MIN = 0
const DEFAULT_X_AXIS_MAX = 1200

export function useChartPlotBounds() {
  const [plotBounds, setPlotBounds] = useState<PlotBounds | null>(null)
  const updateRef = useRef<((chart: Highcharts.Chart) => void) | null>(null)

  const updatePlotBounds = useCallback((chart: Highcharts.Chart) => {
    const next = {
      left: chart.plotLeft,
      top: chart.plotTop,
      width: chart.plotWidth,
      height: chart.plotHeight,
    }
    setPlotBounds((prev) => {
      if (!prev) return next
      if (
        prev.left === next.left &&
        prev.top === next.top &&
        prev.width === next.width &&
        prev.height === next.height
      ) {
        return prev
      }
      return next
    })
  }, [])

  useEffect(() => {
    updateRef.current = updatePlotBounds
  }, [updatePlotBounds])

  const chartEvents: Highcharts.Options['chart'] = {
    events: {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      load: function (this: Highcharts.Chart) {
        updateRef.current?.(this)
      },
      redraw: function (this: Highcharts.Chart) {
        updateRef.current?.(this)
      },
    },
  }

  return { plotBounds, chartEvents }
}

export function DissonanceChartOverlay(props: {
  plotBounds: PlotBounds | null
  meanFrequency: number
  onIntervalChange?: (interval: number | null, mouseY?: number) => void
  xAxisMin?: number
  xAxisMax?: number
  volume?: number
}) {
  const {
    plotBounds,
    meanFrequency,
    onIntervalChange,
    xAxisMin = DEFAULT_X_AXIS_MIN,
    xAxisMax = DEFAULT_X_AXIS_MAX,
    volume = 1,
  } = props

  const [currentInterval, setCurrentInterval] = useState<number | null>(null)
  const synthRef = useRef<AdditiveSynth | null>(null)
  const isActiveRef = useRef(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const mouseXToInterval = useCallback(
    (offsetX: number, plotWidth: number) => {
      const ratio = offsetX / plotWidth
      return ratio * (xAxisMax - xAxisMin) + xAxisMin
    },
    [xAxisMin, xAxisMax],
  )

  const isWithinBounds = useCallback(
    (interval: number) => interval >= xAxisMin && interval <= xAxisMax,
    [xAxisMin, xAxisMax],
  )

  const ensureSynth = useCallback(() => {
    if (synthRef.current) return synthRef.current
    if (typeof AudioContext === 'undefined') return null
    const synth = new AdditiveSynth({
      spectrum: [{ partials: [{ rate: 1, amplitude: 0.2 }] }],
      audioContext: new AudioContext(),
      adsr: { attack: 0.1, sustain: 1, release: 0.1, decay: 0 },
    })
    synthRef.current = synth
    return synth
  }, [])

  const updateSynthForInterval = useCallback(
    (interval: number) => {
      const synth = ensureSynth()
      if (!synth || !isWithinBounds(interval)) return

      const [f1, f2] = getIntervalFrequencies(Math.round(interval), meanFrequency)

      if (isActiveRef.current) {
        synth.update([{
          partials: [
            { rate: f1, amplitude: 1 },
            { rate: f2, amplitude: 1 },
          ],
        }])
      } else {
        synth.update([{
          partials: [
            { rate: f1, amplitude: 1 },
            { rate: f2, amplitude: 1 },
          ],
        }])
        synth.play({ pitch: 1, velocity: 0.5 * volume })
        isActiveRef.current = true
      }
    },
    [meanFrequency, isWithinBounds, volume, ensureSynth],
  )

  const stopPlaying = useCallback(() => {
    setCurrentInterval(null)
    onIntervalChange?.(null)
    if (synthRef.current) {
      synthRef.current.releaseAll()
    }
    isActiveRef.current = false
  }, [onIntervalChange])

  const getMouseY = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!plotBounds || !overlayRef.current) return undefined
      const rect = overlayRef.current.getBoundingClientRect()
      const offsetY = e.clientY - rect.top
      return plotBounds.top + offsetY
    },
    [plotBounds],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!plotBounds) return
      e.currentTarget.setPointerCapture(e.pointerId)
      const interval = mouseXToInterval(e.nativeEvent.offsetX, plotBounds.width)
      const clampedInterval = Math.round(Math.max(xAxisMin, Math.min(xAxisMax, interval)))
      setCurrentInterval(clampedInterval)
      onIntervalChange?.(clampedInterval, getMouseY(e))
      if (isWithinBounds(interval)) {
        updateSynthForInterval(clampedInterval)
      }
    },
    [plotBounds, mouseXToInterval, updateSynthForInterval, isWithinBounds, xAxisMin, xAxisMax, onIntervalChange, getMouseY],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!plotBounds || !isActiveRef.current) return
      const rect = overlayRef.current?.getBoundingClientRect()
      if (!rect) return
      const offsetX = e.clientX - rect.left
      const interval = mouseXToInterval(offsetX, plotBounds.width)
      const clampedInterval = Math.round(Math.max(xAxisMin, Math.min(xAxisMax, interval)))
      setCurrentInterval(clampedInterval)
      onIntervalChange?.(clampedInterval, getMouseY(e))
      if (isWithinBounds(interval)) {
        updateSynthForInterval(clampedInterval)
      }
    },
    [plotBounds, mouseXToInterval, updateSynthForInterval, isWithinBounds, xAxisMin, xAxisMax, onIntervalChange, getMouseY],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId)
      stopPlaying()
    },
    [stopPlaying],
  )

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isActiveRef.current) {
        stopPlaying()
      }
    }
    window.addEventListener('pointerup', handleGlobalPointerUp)
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp)
  }, [stopPlaying])

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.releaseAll()
      }
    }
  }, [])

  if (!plotBounds) return null

  return (
    <div
      ref={overlayRef}
      className="absolute z-10 select-none"
      style={{
        left: plotBounds.left,
        top: plotBounds.top,
        width: plotBounds.width,
        height: plotBounds.height,
        cursor: "url('/volume-icon.svg') 8 8, crosshair",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  )
}
