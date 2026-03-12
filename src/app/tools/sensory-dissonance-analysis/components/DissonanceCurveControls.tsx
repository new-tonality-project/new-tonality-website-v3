'use client'

import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
} from 'sethares-dissonance'
import { DragNumberInput } from '@/components'
import { Checkbox, CheckboxField } from '@/components/catalyst/checkbox'
import { Label } from '@headlessui/react'
import type { ChartSettings } from './types'

type DissonanceCurveControlsProps = {
  value: ChartSettings
  onChange: (params: ChartSettings) => void
}

export function DissonanceCurveControls({
  value,
  onChange,
}: DissonanceCurveControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full lg:max-w-none pb-8">
      <CheckboxField>
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
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <DragNumberInput
              defaultValue={0}
              value={value.xAxisStart}
              min={-3600}
              max={Math.max(0, value.xAxisEnd - 1)}
              minStep={1}
              valueRange={1000}
              whole
              label="Start (cents)"
              onChange={(xAxisStart) => onChange({ ...value, xAxisStart })}
            />
            <DragNumberInput
              defaultValue={1200}
              value={value.xAxisEnd}
              min={Math.min(1200, value.xAxisStart + 1)}
              max={3600}
              minStep={1}
              valueRange={1000}
              whole
              label="End (cents)"
              onChange={(xAxisEnd) => onChange({ ...value, xAxisEnd })}
            />
            <DragNumberInput
              defaultValue={0}
              value={value.phantomHarmonicsNumber}
              min={0}
              minStep={1}
              max={20}
              valueRange={10}
              label="Phantom harmonics"
              onChange={(phantomHarmonicsNumber) =>
                onChange({ ...value, phantomHarmonicsNumber })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-neutral-500">
              First order beating contribution
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.magnitude}
                value={
                  value.firstOrderDissonance.magnitude ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.magnitude
                }
                min={0}
                max={1}
                minStep={0.01}
                valueRange={0.5}
                label="Magnitude"
                onChange={(magnitude) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      magnitude,
                    },
                  })
                }
              />
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.x_star}
                value={
                  value.firstOrderDissonance.x_star ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.x_star
                }
                min={0.001}
                valueRange={0.1}
                label="x*"
                onChange={(x_star) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      x_star,
                    },
                  })
                }
              />
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b1}
                value={
                  value.firstOrderDissonance.b1 ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b1
                }
                min={0.01}
                minStep={0.01}
                max={
                  (value.firstOrderDissonance.b2 ??
                    DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b2) - 0.01
                }
                valueRange={1}
                label="b1"
                onChange={(b1) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      b1,
                    },
                  })
                }
              />
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b2}
                value={
                  value.firstOrderDissonance.b2 ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b2
                }
                min={
                  (value.firstOrderDissonance.b1 ??
                    DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.b1) + 0.01
                }
                minStep={0.01}
                valueRange={1}
                label="b2"
                onChange={(b2) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      b2,
                    },
                  })
                }
              />
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s1}
                value={
                  value.firstOrderDissonance.s1 ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s1
                }
                min={0.001}
                valueRange={0.1}
                label="s1"
                onChange={(s1) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      s1,
                    },
                  })
                }
              />
              <DragNumberInput
                defaultValue={DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s2}
                value={
                  value.firstOrderDissonance.s2 ??
                  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS.s2
                }
                min={0.1}
                minStep={0.1}
                valueRange={10}
                label="s2"
                onChange={(s2) =>
                  onChange({
                    ...value,
                    firstOrderDissonance: {
                      ...value.firstOrderDissonance,
                      s2,
                    },
                  })
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <CheckboxField>
              <Checkbox
                checked={(value.secondOrderDissonance.magnitude ?? 0) > 0}
                onChange={(checked) =>
                  onChange({
                    ...value,
                    secondOrderDissonance: {
                      ...value.secondOrderDissonance,
                      magnitude: checked
                        ? (value.secondOrderDissonance.magnitude ||
                            DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude)
                        : 0,
                    },
                  })
                }
              />
              <Label className="text-sm">Second order beating contribution</Label>
            </CheckboxField>
            {(value.secondOrderDissonance.magnitude ?? 0) > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                  <DragNumberInput
                    defaultValue={
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude
                    }
                    value={
                      value.secondOrderDissonance.magnitude ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude
                    }
                    min={0}
                    max={1}
                    minStep={0.01}
                    valueRange={0.5}
                    label="Magnitude"
                    onChange={(magnitude) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          magnitude,
                        },
                      })
                    }
                  />
                  <DragNumberInput
                    defaultValue={
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.x_star
                    }
                    value={
                      value.secondOrderDissonance.x_star ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.x_star
                    }
                    min={0.001}
                    valueRange={0.1}
                    label="x*"
                    onChange={(x_star) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          x_star,
                        },
                      })
                    }
                  />
                  <DragNumberInput
                    defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b1}
                    value={
                      value.secondOrderDissonance.b1 ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b1
                    }
                    min={0.01}
                    minStep={0.01}
                    max={
                      (value.secondOrderDissonance.b2 ??
                        DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b2) - 0.01
                    }
                    valueRange={1}
                    label="b1"
                    onChange={(b1) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          b1,
                        },
                      })
                    }
                  />
                  <DragNumberInput
                    defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b2}
                    value={
                      value.secondOrderDissonance.b2 ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b2
                    }
                    min={
                      (value.secondOrderDissonance.b1 ??
                        DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.b1) + 0.01
                    }
                    minStep={0.01}
                    valueRange={1}
                    label="b2"
                    onChange={(b2) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          b2,
                        },
                      })
                    }
                  />
                  <DragNumberInput
                    defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.s1}
                    value={
                      value.secondOrderDissonance.s1 ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.s1
                    }
                    min={0.001}
                    valueRange={0.1}
                    label="s1"
                    onChange={(s1) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          s1,
                        },
                      })
                    }
                  />
                  <DragNumberInput
                    defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.s2}
                    value={
                      value.secondOrderDissonance.s2 ??
                      DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.s2
                    }
                    min={0.1}
                    minStep={0.1}
                    valueRange={10}
                    label="s2"
                    onChange={(s2) =>
                      onChange({
                        ...value,
                        secondOrderDissonance: {
                          ...value.secondOrderDissonance,
                          s2,
                        },
                      })
                    }
                  />
              </div>
            )}
          </div>

          {(value.secondOrderDissonance.magnitude ?? 0) > 0 && (
            <div className="flex flex-col gap-2">
              <CheckboxField>
                <Checkbox
                  checked={(value.thirdOrderDissonance.magnitude ?? 0) > 0}
                  onChange={(checked) =>
                    onChange({
                      ...value,
                      thirdOrderDissonance: {
                        ...value.thirdOrderDissonance,
                        magnitude: checked
                          ? (value.thirdOrderDissonance.magnitude ||
                              DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude)
                          : 0,
                      },
                    })
                  }
                />
                <Label className="text-sm">
                  Third order beating contribution
                </Label>
              </CheckboxField>
              {(value.thirdOrderDissonance.magnitude ?? 0) > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <DragNumberInput
                      defaultValue={
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude
                      }
                      value={
                        value.thirdOrderDissonance.magnitude ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude
                      }
                      min={0}
                      max={1}
                      minStep={0.01}
                      valueRange={0.5}
                      label="Magnitude"
                      onChange={(magnitude) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            magnitude,
                          },
                        })
                      }
                    />
                    <DragNumberInput
                      defaultValue={
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.x_star
                      }
                      value={
                        value.thirdOrderDissonance.x_star ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.x_star
                      }
                      min={0.001}
                      valueRange={0.1}
                      label="x*"
                      onChange={(x_star) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            x_star,
                          },
                        })
                      }
                    />
                    <DragNumberInput
                      defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b1}
                      value={
                        value.thirdOrderDissonance.b1 ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b1
                      }
                      min={0.01}
                      minStep={0.01}
                      max={
                        (value.thirdOrderDissonance.b2 ??
                          DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b2) - 0.01
                      }
                      valueRange={1}
                      label="b1"
                      onChange={(b1) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            b1,
                          },
                        })
                      }
                    />
                    <DragNumberInput
                      defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b2}
                      value={
                        value.thirdOrderDissonance.b2 ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b2
                      }
                      min={
                        (value.thirdOrderDissonance.b1 ??
                          DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.b1) + 0.01
                      }
                      minStep={0.01}
                      valueRange={1}
                      label="b2"
                      onChange={(b2) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            b2,
                          },
                        })
                      }
                    />
                    <DragNumberInput
                      defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.s1}
                      value={
                        value.thirdOrderDissonance.s1 ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.s1
                      }
                      min={0.001}
                      valueRange={0.1}
                      label="s1"
                      onChange={(s1) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            s1,
                          },
                        })
                      }
                    />
                    <DragNumberInput
                      defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.s2}
                      value={
                        value.thirdOrderDissonance.s2 ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.s2
                      }
                      min={0.1}
                      minStep={0.1}
                      valueRange={10}
                      label="s2"
                      onChange={(s2) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            s2,
                          },
                        })
                      }
                    />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
