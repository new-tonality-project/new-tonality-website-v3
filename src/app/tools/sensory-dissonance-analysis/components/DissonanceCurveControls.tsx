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
  yourResultDisabled?: boolean
  secondOrderEnabled: boolean
  thirdOrderEnabled: boolean
  onSecondOrderEnabledChange: (enabled: boolean) => void
  onThirdOrderEnabledChange: (enabled: boolean) => void
}

export function DissonanceCurveControls({
  value,
  onChange,
  yourResultDisabled = false,
  secondOrderEnabled,
  thirdOrderEnabled,
  onSecondOrderEnabledChange,
  onThirdOrderEnabledChange,
}: DissonanceCurveControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full lg:max-w-none pb-8">
      <div className="grid grid-cols-2 gap-4">
        <CheckboxField>
          <Checkbox
            checked={value.showOtherParticipants}
            onChange={(checked) =>
              onChange({
                ...value,
                showOtherParticipants: checked,
              })
            }
          />
          <Label className="text-sm">Show other participant results</Label>
        </CheckboxField>

        <CheckboxField>
          <Checkbox
            checked={yourResultDisabled ? false : value.showYourResult}
            disabled={yourResultDisabled}
            onChange={(checked) =>
              onChange({
                ...value,
                showYourResult: checked,
              })
            }
          />
          <Label className="text-sm">Show your result</Label>
        </CheckboxField>

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

        <CheckboxField>
          <Checkbox
            checked={value.showPnLResults}
            onChange={(checked) =>
              onChange({
                ...value,
                showPnLResults: checked,
              })
            }
          />
          <Label className="text-sm">Show P&amp;L results</Label>
        </CheckboxField>
      </div>

      {value.showExponentialFit && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <DragNumberInput
              variant="mini"
              defaultValue={0}
              value={value.xAxisStart}
              min={0}
              max={Math.max(0, value.xAxisEnd - 1)}
              minStep={1}
              valueRange={1000}
              whole
              label="Start (cents)"
              onChange={(xAxisStart) => onChange({ ...value, xAxisStart })}
            />
            <DragNumberInput
              variant="mini"
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
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-neutral-500">
              First order beating contribution
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <DragNumberInput
                variant="mini"
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
                variant="mini"
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
                variant="mini"
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
                variant="mini"
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
                variant="mini"
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
                variant="mini"
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
                checked={secondOrderEnabled}
                onChange={(checked) => {
                  onSecondOrderEnabledChange(checked)
                  if (checked) {
                    onChange({
                      ...value,
                      secondOrderDissonance: {
                        ...value.secondOrderDissonance,
                        magnitude:
                          value.secondOrderDissonance.magnitude ||
                          DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitude,
                      },
                    })
                  }
                }}
              />
              <Label className="text-sm">Second order beating contribution</Label>
            </CheckboxField>
            {secondOrderEnabled && (
              <div className="flex items-center gap-2 flex-wrap">
                <DragNumberInput
                  variant="mini"
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
                  variant="mini"
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
                  variant="mini"
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
                  variant="mini"
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
                  variant="mini"
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
                  variant="mini"
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
                <DragNumberInput
                  variant="mini"
                  defaultValue={
                    DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
                  }
                  value={
                    value.secondOrderDissonance.magnitudeFrequencyDecay ??
                    DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
                  }
                  min={0}
                  minStep={0.01}
                  valueRange={1}
                  label="Magnitude freq. decay"
                  onChange={(magnitudeFrequencyDecay) =>
                    onChange({
                      ...value,
                      secondOrderDissonance: {
                        ...value.secondOrderDissonance,
                        magnitudeFrequencyDecay,
                      },
                    })
                  }
                />
              </div>
            )}
          </div>

          {secondOrderEnabled && (
            <div className="flex flex-col gap-2">
              <CheckboxField>
                <Checkbox
                  checked={thirdOrderEnabled}
                  onChange={(checked) => {
                    onThirdOrderEnabledChange(checked)
                    if (checked) {
                      onChange({
                        ...value,
                        thirdOrderDissonance: {
                          ...value.thirdOrderDissonance,
                          magnitude:
                            value.thirdOrderDissonance.magnitude ||
                            DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitude,
                        },
                      })
                    }
                  }}
                />
                <Label className="text-sm">
                  Third order beating contribution
                </Label>
              </CheckboxField>
              {thirdOrderEnabled && (
                <>
                  <DragNumberInput
                    variant="mini"
                    defaultValue={3}
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <DragNumberInput
                      variant="mini"
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
                      variant="mini"
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
                      variant="mini"
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
                      variant="mini"
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
                      variant="mini"
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
                      variant="mini"
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
                    <DragNumberInput
                      variant="mini"
                      defaultValue={
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
                      }
                      value={
                        value.thirdOrderDissonance.magnitudeFrequencyDecay ??
                        DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
                      }
                      min={0}
                      minStep={0.01}
                      valueRange={1}
                      label="Magnitude freq. decay"
                      onChange={(magnitudeFrequencyDecay) =>
                        onChange({
                          ...value,
                          thirdOrderDissonance: {
                            ...value.thirdOrderDissonance,
                            magnitudeFrequencyDecay,
                          },
                        })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
