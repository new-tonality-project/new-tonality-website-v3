'use client'

import { Button } from '@/components'
import {
  CheckboxGroup,
  CheckboxField,
  Checkbox,
} from '@/components/catalyst/checkbox'
import {
  Description,
  Fieldset,
  Label,
  Legend,
} from '@/components/catalyst/fieldset'
import { useSurveyMachine } from './useSurveyMachine'
import { Text } from '@/components/catalyst/text'
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio'

export function SurveyQuestions() {
  const [state, send] = useSurveyMachine()

  return (
    <Fieldset>
      <Legend>What is your musical background?</Legend>
      <Text>Choose an option that applies the most to you.</Text>
      <RadioGroup
        name="musical-background"
        className="pb-12"
        onChange={(e) => {
          send({
            type: 'setMusicalBackground',
            value: e.valueOf(),
          })
        }}
      >
        <RadioField>
          <Radio value="naive-listener" />
          <Label>I just enjoy listening to music</Label>
          <Description>
            I do not sing or play an instrument. I have no formal training or
            experience in performing music. I just like what sounds good to me
            and dont know much about music theory.
          </Description>
        </RadioField>

        <RadioField>
          <Radio value="musician" />
          <Label>I am a musician</Label>
          <Description>
            I can compose or perform music. I do it as a hobby or
            professionally.
          </Description>
        </RadioField>

        <RadioField>
          <Radio value="microtonalist" />
          <Label>I am a microtonalist</Label>
          <Description>
            I moved beyond 12TET in my musical journey. I frequently listen to
            microtonal music or use microtonal tuning systems in my music. I may
            not be a musician myself but I have a trained ear that can
            appreciate a suttle world of microtones.
          </Description>
        </RadioField>
      </RadioGroup>

      <Legend>How do you want to share your results?</Legend>
      <Text>
        We never share your data with 3rd party data brokers. Your data will be
        used only in scope of New Tonality project.
      </Text>
      <CheckboxGroup>
        <CheckboxField>
          <Checkbox
            name="disclamer"
            value="share_anonymously"
            checked={
              state.context.shareAnonymously || state.context.sharePublicly
            }
            onChange={(e) =>
              send({
                type: 'setShareAnonymously',
                value: e.valueOf(),
              })
            }
            disabled={state.context.sharePublicly}
          />
          <Label>Allow to share anonymously</Label>
          <Description>
            We have to share your results as part of aggregated dataset without
            exposing your username. You will be able to see your result if you
            log in, but you will not be able to share it with others by linking
            to it.
          </Description>
        </CheckboxField>
        <CheckboxField>
          <Checkbox
            name="disclamer"
            value="share_publicly"
            checked={state.context.sharePublicly}
            onChange={(e) => {
              send({
                type: 'setSharePublicly',
                value: e.valueOf(),
              })
            }}
          />
          <Label>Allow to share publicly</Label>
          <Description>
            By accepting this option you agree that your results may be shared publicly
            under your username. You will be able to share your result with
            others by linking to it.
          </Description>
        </CheckboxField>
      </CheckboxGroup>
      
    </Fieldset>
  )
}
