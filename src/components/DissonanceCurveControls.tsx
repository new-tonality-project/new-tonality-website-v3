'use client'

import {
  DEFAULT_FIRST_ORDER_DISSONANCE_PARAMS,
  DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS,
  DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS,
  DEFAULT_PHANTOM_HARMONICS_NUMBER,
  type DissonanceParams,
} from 'sethares-dissonance'
import { DragNumberInput } from '@/components/DragNumberInput'
import { SidebarSection } from '@/components/SidebarSection'

export type DissonanceCurveSettings = Required<DissonanceParams>

type DissonanceCurveControlsProps<T extends DissonanceCurveSettings> = {
  value: T
  onChange: (params: T) => void
}

export function DissonanceCurveControls<T extends DissonanceCurveSettings>({
  value,
  onChange,
}: DissonanceCurveControlsProps<T>) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <SidebarSection title="Phantom harmonics">
        <DragNumberInput
          variant="mini"
          defaultValue={DEFAULT_PHANTOM_HARMONICS_NUMBER}
          value={value.phantomHarmonicsNumber}
          min={0}
          minStep={1}
          max={20}
          valueRange={10}
          whole
          label="Count"
          onChange={(phantomHarmonicsNumber) =>
            onChange({ ...value, phantomHarmonicsNumber })
          }
        />
      </SidebarSection>


      <SidebarSection className="pt-8" classNameContent="gap-2 flex-row flex-wrap" title="First order beating">
        <div className='w-full'>

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
        </div>

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
      </SidebarSection>

      <SidebarSection className="pt-8" classNameContent="gap-2 flex-row flex-wrap" title="Second order beating">
        <div className=' flex flex-row gap-2 w-full'>
          <DragNumberInput
            variant="mini"
            defaultValue={0}
            value={value.secondOrderDissonance.magnitude ?? 0}
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
              DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
            }
            value={
              value.secondOrderDissonance.magnitudeFrequencyDecay ??
              DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
            }
            min={0}
            minStep={0.01}
            valueRange={1}
            label="Freq. decay"
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

        <DragNumberInput
          variant="mini"
          defaultValue={DEFAULT_SECOND_ORDER_DISSONANCE_PARAMS.x_star}
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

      </SidebarSection>

      <SidebarSection className="pt-8" classNameContent="gap-2 flex-row flex-wrap" title="Third order beating">

        <div className=' flex flex-row gap-2 w-full'>

          <DragNumberInput
            variant="mini"
            defaultValue={0}
            value={value.thirdOrderDissonance.magnitude ?? 0}
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
              DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
            }
            value={
              value.thirdOrderDissonance.magnitudeFrequencyDecay ??
              DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.magnitudeFrequencyDecay
            }
            min={0}
            minStep={0.01}
            valueRange={1}
            label="Freq. decay"
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
        <DragNumberInput
          variant="mini"
          defaultValue={DEFAULT_THIRD_ORDER_DISSONANCE_PARAMS.x_star}
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

      </SidebarSection>
    </div>
  )
}
