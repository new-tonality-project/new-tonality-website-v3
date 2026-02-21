'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import throttle from 'lodash-es/throttle'
import debounce from 'lodash-es/debounce'
import { clsx } from 'clsx'
import { ChevronDownIcon, CloseIcon } from '@/components/Icons'

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
}: DragNumberInputProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const value = isControlled ? controlledValue : internalValue

  const [isFocused, setIsFocused] = useState(false)
  const [draftValue, setDraftValue] = useState<string | null>(null)
  const fineRef = useRef(false)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)

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

  const pointerDown = useCallback(
    (e: React.PointerEvent) => {
      startYRef.current = e.clientY
      startValueRef.current = value

      const onPointerMove = (ev: PointerEvent) => pointerMove(ev)
      const onPointerUp = () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    },
    [value, pointerMove]
  )

  const reset = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isControlled) setInternalValue(defaultValue)
      onChange?.(defaultValue)
      onDebouncedChange?.(defaultValue)
    },
    [defaultValue, isControlled, onChange, onDebouncedChange]
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

  const displayValue = isFocused && draftValue !== null ? draftValue : String(value)
  const padding = valueRange <= 0.1 ? 4 : valueRange < 100 ? 3 : 0
  const inputWidth = Math.max(
    displayValue.length,
    Math.floor(value).toString().length + padding
  )

  const showReset = !nonResettable && value !== defaultValue

  return (
    <div
      className={clsx(
        'group relative flex max-w-fit items-center gap-1 pl-3 pr-2 py-1 text-xs rounded-lg bg-white border border-gray-200',
        disabled
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-ns-resize hover:border-gray-300',
        className
      )}
      onPointerDown={disabled ? undefined : pointerDown}
    >
            <span
        className="flex mr-1 shrink-0 flex-col items-center gap-0 opacity-60 transition-[gap] duration-200 group-hover:gap-0.5"
        aria-hidden
      >
        <ChevronDownIcon className="size-2.5 rotate-180" stroke="currentColor" />
        <ChevronDownIcon className="size-2.5" stroke="currentColor" />
      </span>
      <span className="select-none">{label} =</span>
      <input
        type="number"
        step={whole ? 1 : minStep}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-12 border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:cursor-not-allowed"
        style={{ width: `${inputWidth}ch` }}
      />

      {showReset && !disabled && (
        <button
          type="button"
          onClick={reset}
          className="absolute right-0.5 top-0.5 flex size-[18px] -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          aria-label="Reset to default"
        >
          <CloseIcon className="size-[12px]" stroke="currentColor" />
        </button>
      )}
    </div>
  )
}
