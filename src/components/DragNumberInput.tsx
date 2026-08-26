'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import throttle from 'lodash-es/throttle'
import debounce from 'lodash-es/debounce'
import { twMerge } from 'tailwind-merge'
import { ChevronDownIcon, CloseIcon } from '@/components/Icons'

export type DragNumberInputVariant = 'outlined' | 'mini'

export type DragNumberInputProps = {
  defaultValue: number
  value?: number
  onChange?: (v: number) => void
  onDebouncedChange?: (v: number) => void
  min?: number
  max?: number
  pixelRange?: number
  valueRange: number
  minStep?: number
  label: string
  whole?: boolean
  nonResettable?: boolean
  className?: string
  disabled?: boolean
  variant?: DragNumberInputVariant
}

function clamp(num: number, min: number, max: number, whole: boolean) {
  const val = Math.max(min, Math.min(num, max))
  return whole ? Math.floor(val) : val
}

function quantize(val: number, step: number): number {
  if (step <= 0) return val
  const result = Math.round(val / step) * step
  // Normalize to avoid floating point artifacts and trailing zeros in display
  const decimals = Math.max(0, Math.ceil(-Math.log10(step)))
  return parseFloat(result.toFixed(decimals))
}

export function DragNumberInput({
  defaultValue,
  value: controlledValue,
  onChange,
  onDebouncedChange,
  min = -Infinity,
  max = Infinity,
  pixelRange = 100,
  valueRange,
  minStep = 0.001,
  label,
  whole = false,
  nonResettable = false,
  className,
  disabled = false,
  variant = 'outlined',
}: DragNumberInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue

  const [isFocused, setIsFocused] = useState(false)
  const [draftValue, setDraftValue] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fineRef = useRef(false)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)
  const lastPointerUpRef = useRef(0)
  const isMini = variant === 'mini'

  const updateValue = useCallback(
    (v: number) => {
      const quantized = whole ? v : quantize(v, minStep)
      const clamped = clamp(quantized, min, max, whole)
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
    },
    [isControlled, min, max, whole, minStep, onChange]
  )

  const setValue = useMemo(
    () =>
      throttle(
        (v: number) => updateValue(v),
        10,
        { leading: false }
      ),
    [updateValue]
  )

  const setDebouncedValue = useMemo(
    () =>
      debounce((v: number) => {
        onDebouncedChange?.(v)
      }, 50),
    [onDebouncedChange]
  )

  useEffect(() => {
    return () => {
      setValue.cancel()
      setDebouncedValue.cancel()
    }
  }, [setValue, setDebouncedValue])

  useEffect(() => {
    const handleFineAdjustment = (e: KeyboardEvent) => {
      fineRef.current = e.shiftKey
    }
    window.addEventListener('keydown', handleFineAdjustment)
    window.addEventListener('keyup', handleFineAdjustment)
    return () => {
      fineRef.current = false
      window.removeEventListener('keydown', handleFineAdjustment)
      window.removeEventListener('keyup', handleFineAdjustment)
    }
  }, [])


  const pointerMove = useCallback(
    (e: PointerEvent) => {
      const { clientY } = e
      let range = valueRange

      if (valueRange > 1 && fineRef.current) {
        range = whole ? valueRange / 10 : 1
      }
      if (valueRange <= 1 && fineRef.current) {
        range = whole ? 1 : 0.1
      }

      const valueDiff = (range * (clientY - startYRef.current)) / pixelRange
      const val = clamp(startValueRef.current - valueDiff, min, max, whole)

      setValue(val)
      setDebouncedValue(val)
    },
    [valueRange, whole, pixelRange, min, max, setValue, setDebouncedValue]
  )

  const reset = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      if (!isControlled) setInternalValue(defaultValue)
      onChange?.(defaultValue)
      onDebouncedChange?.(defaultValue)
    },
    [defaultValue, isControlled, onChange, onDebouncedChange]
  )

  const pointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Mini: double-click resets (drag overlay would otherwise swallow dblclick).
      if (isMini && !nonResettable) {
        const now = performance.now()
        if (now - lastPointerUpRef.current < 400) {
          lastPointerUpRef.current = 0
          reset()
          return
        }
      }

      const originX = e.clientX
      const originY = e.clientY
      startYRef.current = e.clientY
      startValueRef.current = value

      // Mini: wait for a small move before dragging so double-click can fire.
      // Outlined: start drag immediately (existing behavior).
      const dragThreshold = isMini ? 3 : 0
      let dragStarted = !isMini
      if (!isMini) setIsDragging(true)

      const onPointerMove = (ev: PointerEvent) => {
        if (!dragStarted) {
          const moved =
            Math.abs(ev.clientX - originX) >= dragThreshold ||
            Math.abs(ev.clientY - originY) >= dragThreshold
          if (!moved) return
          dragStarted = true
          lastPointerUpRef.current = 0
          setIsDragging(true)
        }
        pointerMove(ev)
      }

      const onPointerUp = () => {
        if (!dragStarted) {
          lastPointerUpRef.current = performance.now()
        }
        setIsDragging(false)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [value, pointerMove, isMini, nonResettable, reset]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setDraftValue(raw)
      const val = parseFloat(raw)
      if (Number.isNaN(val)) return
      const quantized = whole ? val : quantize(val, minStep)
      const clamped = clamp(quantized, min, max, whole)
      // Only emit onChange when value is within valid range
      if (quantized >= min && quantized <= max) {
        if (!isControlled) setInternalValue(clamped)
        onChange?.(clamped)
        setDebouncedValue(clamped)
      }
    },
    [min, max, whole, minStep, isControlled, onChange, setDebouncedValue]
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setDraftValue(String(value))
  }, [value])

  // Sync draft when value changes from parent while focused (e.g. reset button)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isFocused) setDraftValue(String(value))
  }, [isFocused, value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const raw = draftValue
    setDraftValue(null)
    const val = parseFloat(raw ?? '')
    if (Number.isNaN(val) || val < min || val > max) {
      // Invalid: keep current value, no onChange
      return
    }
    const quantized = whole ? val : quantize(val, minStep)
    const clamped = clamp(quantized, min, max, whole)
    if (!isControlled) setInternalValue(clamped)
    onChange?.(clamped)
    setDebouncedValue(clamped)
  }, [draftValue, min, max, whole, minStep, isControlled, onChange, setDebouncedValue])

  // Mini: whole control is draggable (including the value). Outlined: click input to type.
  const handleInputPointerDown = useCallback(
    (e: React.PointerEvent<HTMLInputElement>) => {
      if (!isMini) {
        e.stopPropagation()
        return
      }
      // Prevent focus/caret so the parent can start a drag.
      e.preventDefault()
    },
    [isMini]
  )

  const displayValue = isFocused && draftValue !== null ? draftValue : String(value)
  const padding = valueRange <= 0.1 ? 4 : valueRange < 100 ? 3 : 0
  const inputWidth = isMini
    ? displayValue.length
    : Math.max(
        displayValue.length,
        Math.floor(value).toString().length + padding
      )

  const showReset = !nonResettable && value !== defaultValue

  const dragOverlay = isDragging && typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed inset-0 z-drag-capture cursor-ns-resize select-none touch-none"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none' }}
          aria-hidden
        />,
        document.body
      )
    : null

  return (
    <>
      {dragOverlay}
      <div
      className={twMerge(
        'group relative flex max-w-fit items-center text-xs',
        isMini
          ? 'gap-0.5 rounded px-1 -ml-1 py-0.5'
          : 'gap-1 rounded-lg border border-gray-200 bg-white py-1 pl-3 pr-2',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-ns-resize',
        !disabled && isMini && 'bg-black/5',
        !disabled && isMini && value !== defaultValue && 'border border-gray-400',
        !disabled && !isMini && 'hover:border-gray-300',
        className
      )}
      title={isMini && !nonResettable ? 'Double-click to reset' : undefined}
      onPointerDown={disabled ? undefined : pointerDown}
    >
      {!isMini && (
        <span
          className="mr-1 flex shrink-0 flex-col items-center gap-0 opacity-60 transition-[gap] duration-200 group-hover:gap-0.5"
          aria-hidden
        >
          <ChevronDownIcon className="size-2.5 rotate-180" stroke="currentColor" />
          <ChevronDownIcon className="size-2.5" stroke="currentColor" />
        </span>
      )}
      <span className="select-none">{label}{isMini ? ':' : ' ='}</span>
      <input
        type="number"
        step={whole ? 1 : minStep}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPointerDown={handleInputPointerDown}
        readOnly={isMini}
        tabIndex={isMini ? -1 : undefined}
        disabled={disabled}
        className={twMerge(
          'w-12 border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed',
          isMini && !disabled && 'cursor-ns-resize'
        )}
        style={{ width: `${inputWidth}ch` }}
      />

      {!isMini && showReset && !disabled && (
        <button
          type="button"
          onClick={reset}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute right-1 top-1 flex size-[18px] -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          aria-label="Reset to default"
        >
          <CloseIcon className="size-[12px]" stroke="currentColor" />
        </button>
      )}
    </div>
    </>
  )
}
