'use client'

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
import { useSurveyMachine } from '@/state/machines'
import { Text, TextLink } from '@/components/catalyst/text'
import { Radio, RadioField, RadioGroup } from '@/components/catalyst/radio'
import { Step } from '@/components/Step'
import { MusicalBackground } from '@/lib'

export function SurveyQuestions() {
  const [state, send] = useSurveyMachine()

  return (
    <>
      <Step className="mb-8" title="Question" number={1} disabled={false}>
        <Fieldset>
          <Legend>What is your musical background?</Legend>
          <Text>Choose an option that applies the most to you.</Text>
          <RadioGroup
            name="musical-background"
            className="pb-12"
            value={state.context.musicalBackground.toString()}
            onChange={(e) => {
              send({
                type: 'setMusicalBackground',
                value: e.valueOf(),
              })
            }}
          >
            <RadioField>
              <Radio value={MusicalBackground.NaiveListener.toString()} />
              <Label>I just enjoy listening to music</Label>
              <Description>
                I do not sing or play an instrument. I have no formal training
                or experience in performing music. I just like what sounds good
                to me and dont know much about music theory.
              </Description>
            </RadioField>

            <RadioField>
              <Radio value={MusicalBackground.Musician.toString()} />
              <Label>I am a musician</Label>
              <Description>
                I can compose or perform music. I do it as a hobby or
                professionally.
              </Description>
            </RadioField>

            <RadioField>
              <Radio value={MusicalBackground.Microtonalist.toString()} />
              <Label>I am a microtonalist</Label>
              <Description>
                I moved beyond 12TET in my musical journey. I frequently listen
                to microtonal music or use microtonal tuning systems in my
                music. I may not be a musician myself but I have a trained ear
                that can appreciate a suttle world of microtones.
              </Description>
            </RadioField>
          </RadioGroup>
        </Fieldset>
      </Step>

      <Step className="mb-8" title="Question" number={2} disabled={false}>
        <Fieldset>
          <Legend>Do you allow us to store and share your data?</Legend>
          <Text>
            By accepting this option you agree that your results will be stored and
            processed by us and 3rd party database providers. You also agree
            that your results can be shared publicly on the New Tonality website
            and social media. If you have questions feel free to contact us
            at <TextLink href="mailto:support@newtonality.net">support@newtonality.net</TextLink>
          </Text>
          <CheckboxGroup>
            <CheckboxField>
              <Checkbox
                name="disclamer"
                value="share_publicly"
                checked={state.context.shareDataPublicly}
                onChange={(e) => {
                  send({
                    type: 'setshareDataPublicly',
                    value: e.valueOf(),
                  })
                }}
              />
              <Label>
                Yes, I agree to collect and share my results with New Tonality project
              </Label>
            </CheckboxField>
          </CheckboxGroup>
        </Fieldset>
      </Step>
    </>
  )
}
