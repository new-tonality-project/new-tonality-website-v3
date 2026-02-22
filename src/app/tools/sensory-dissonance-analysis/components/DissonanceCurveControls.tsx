'use client'

import { useState } from 'react'
import {
  SETHARES_DISSONANCE_PARAMS,
  SECOND_ORDER_BEATING_PARAMS,
  DEFAULT_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import type { SecondOrderBeatingTerm } from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Button } from '@/components/catalyst/button'
import { Label } from '@headlessui/react'
import { PlusIcon, TrashIcon, ChevronDownIcon } from '@/components/Icons'
import type { ChartSettings } from './types'
import { DEFAULT_SECOND_ORDER_TERMS } from './const'

type DissonanceCurveControlsProps = {
  value: ChartSettings
  onChange: (params: ChartSettings) => void
}

export function DissonanceCurveControls({
  value,
  onChange,
}: DissonanceCurveControlsProps) {
  const [termsCollapsed, setTermsCollapsed] = useState(false)
  const sob = value.secondOrderBeating
  const terms = sob?.terms ?? []
  const sobTotalContribution =
    sob?.totalContribution ?? DEFAULT_DISSONANCE_PARAMS.secondOrderBeating.totalContribution

  const updateSecondOrderBeating = (updates: Partial<typeof sob>) => {
    onChange({
      ...value,
      secondOrderBeating: {
        terms: sob?.terms ?? [],
        totalContribution:
          sob?.totalContribution ?? SECOND_ORDER_BEATING_PARAMS.totalContribution,
        ...updates,
      },
    })
  }

  const nextTermIndex = terms.length
  const canAddTerm = nextTermIndex < DEFAULT_SECOND_ORDER_TERMS.length

  const addTerm = () => {
    if (!canAddTerm) return
    const nextTerm = DEFAULT_SECOND_ORDER_TERMS[nextTermIndex]
    updateSecondOrderBeating({
      terms: [...terms, { ...nextTerm }],
    })
  }

  const updateTerm = (index: number, updates: Partial<SecondOrderBeatingTerm>) => {
    const newTerms = [...terms]
    newTerms[index] = { ...newTerms[index], ...updates }
    updateSecondOrderBeating({ terms: newTerms })
  }

  const removeTerm = (index: number) => {
    updateSecondOrderBeating({
      terms: terms.filter((_, i) => i !== index),
    })
  }

  return (
    <>
      <div className="flex items-start gap-8 w-full lg:max-w-none pb-8">
        <CheckboxField className="min-w-42">
          <Checkbox
            checked={value.showExponentialFit}
            onChange={(checked) =>
              onChange({
                ...value,
                showExponentialFit: checked,
              })
            }
          />
          <Label className="text-sm">Show theoretical fit</Label>
        </CheckboxField>

        {value.showExponentialFit && (
          <div className="flex items-center gap-2 flex-wrap grow lg:max-w-none">
            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.x_star}
              value={value.x_star}
              disabled={!value.showExponentialFit}
              min={0.001}
              max={1}
              valueRange={0.1}
              label="x*"
              onChange={(x_star) => onChange({ ...value, x_star })}
            />

            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.b1}
              value={value.b1}
              disabled={!value.showExponentialFit}
              min={0.01}
              minStep={0.01}
              max={10}
              valueRange={1}
              label="b1"
              onChange={(b1) => onChange({ ...value, b1 })}
            />

            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.b2}
              value={value.b2}
              disabled={!value.showExponentialFit}
              min={0.01}
              minStep={0.01}
              max={10}
              valueRange={1}
              label="b2"
              onChange={(b2) => onChange({ ...value, b2 })}
            />

            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.s1}
              value={value.s1}
              disabled={!value.showExponentialFit}
              min={0.001}
              max={1}
              valueRange={0.1}
              label="s1"
              onChange={(s1) => onChange({ ...value, s1 })}
            />

            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.s2}
              value={value.s2}
              disabled={!value.showExponentialFit}
              min={0.1}
              minStep={0.1}
              max={100}
              valueRange={10}
              label="s2"
              onChange={(s2) => onChange({ ...value, s2 })}
            />
            <DragNumberInput
              defaultValue={SETHARES_DISSONANCE_PARAMS.totalContribution}
              value={value.totalContribution}
              disabled={!value.showExponentialFit}
              min={0.001}
              max={2}
              valueRange={0.1}
              label="A"
              onChange={(totalContribution) =>
                onChange({ ...value, totalContribution })
              }
            />
          </div>
        )}
      </div>

      {value.showExponentialFit && <div className="flex items-start gap-8 w-full lg:max-w-none pb-8">
        <CheckboxField className="min-w-42">
          <Checkbox
            checked={value.showSecondOrderBeating}
            onChange={(checked) =>
              onChange({
                ...value,
                showSecondOrderBeating: checked,
              })
            }
          />
          <Label className="text-sm">Second order beating</Label>
        </CheckboxField>

        {value.showSecondOrderBeating && (
          <div className="flex flex-col gap-4 grow lg:max-w-none">
            <div className="flex items-center gap-2 flex-wrap">
              <DragNumberInput
                defaultValue={
                  DEFAULT_DISSONANCE_PARAMS.secondOrderBeating.totalContribution
                }
                value={sobTotalContribution}
                disabled={!value.showSecondOrderBeating}
                min={0.001}
                max={2}
                valueRange={0.1}
                label="A (2nd order)"
                onChange={(totalContribution) =>
                  updateSecondOrderBeating({ totalContribution })
                }
              />
              <Button
                outline
                onClick={addTerm}
                disabled={!canAddTerm}
                className="shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <PlusIcon className="size-4" stroke="currentColor" />
                Add term
              </Button>
              {terms.length > 0 && (
                <Button
                  plain
                  onClick={() => setTermsCollapsed((c) => !c)}
                  className="shrink-0 flex items-center gap-2 cursor-pointer"
                  aria-label={termsCollapsed ? 'Expand terms' : 'Collapse terms'}
                >
                  <ChevronDownIcon
                    className={`size-4 transition-transform ${termsCollapsed ? '' : 'rotate-180'}`}
                    
                    stroke="currentColor"
                  />
                  {termsCollapsed ? 'Expand' : 'Collapse'}
                </Button>
              )}
            </div>

            {!termsCollapsed && terms.map((term, index) => {
              const defaultTerm = DEFAULT_SECOND_ORDER_TERMS[index] ?? DEFAULT_SECOND_ORDER_TERMS[0]
              return (
              <div
                key={index}
                className="flex items-center gap-2 flex-wrap pl-4 border-l-2 border-zinc-200 dark:border-zinc-700"
              >
                <span className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">
                  Term {index + 1}
                </span>
                <DragNumberInput
                  defaultValue={defaultTerm.ratio}
                  value={term.ratio}
                  disabled={!value.showSecondOrderBeating}
                  min={0.01}
                  max={100}
                  valueRange={1}
                  label="ratio"
                  onChange={(ratio) => updateTerm(index, { ratio })}
                />
                <DragNumberInput
                  defaultValue={defaultTerm.magnitude}
                  value={term.magnitude}
                  disabled={!value.showSecondOrderBeating}
                  min={0.001}
                  max={10}
                  valueRange={0.5}
                  label="magnitude"
                  onChange={(magnitude) => updateTerm(index, { magnitude })}
                />
                <Button
                  plain
                  onClick={() => removeTerm(index)}
                  className="shrink-0 cursor-pointer h-8"
                  aria-label="Remove term"
                >
                  <TrashIcon className="size-4" stroke="currentColor" />
                </Button>
              </div>
            )})}
          </div>
        )}
      </div>}
    </>
  )
}
