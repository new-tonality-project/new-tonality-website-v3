'use client'

import { useState } from 'react'
import { db } from '@/db'
import { SurveyChart, SurveyChartPublic } from './'
import { EXPERIMENTS } from '../utils'
import { MusicalBackground } from '@/lib/types'
import type { ChartSettings } from './types'
import {
  CheckboxGroup,
  CheckboxField,
  Checkbox,
} from '@/components/catalyst/checkbox'
import {
  Fieldset,
  Field,
  Label,
} from '@/components/catalyst/fieldset'
import { Select } from '@/components/catalyst/select'
import { CollapsiblePanel } from '@/components'

export function ExperimentCharts() {
  const [settings, setSettings] = useState<ChartSettings>({
    showAverage: false,
    showExponentialFit: false,
    userType: undefined,
  })

  return (
    <>
      <CollapsiblePanel title="Chart Settings" className="mb-8">
        <Fieldset>
          <div className="space-y-6">
            <CheckboxGroup>
              <CheckboxField>
                <Checkbox
                  checked={settings.showAverage}
                  onChange={(checked) =>
                    setSettings((prev) => ({ ...prev, showAverage: checked }))
                  }
                />
                <Label>Show average</Label>
              </CheckboxField>

              <CheckboxField>
                <Checkbox
                  checked={settings.showExponentialFit}
                  onChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      showExponentialFit: checked,
                    }))
                  }
                />
                <Label>Show exponential fit</Label>
              </CheckboxField>
            </CheckboxGroup>

            <Field>
              <Label>Filter by musical background</Label>
              <Select
                value={settings.userType?.toString()}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    userType: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              >
                <option value={undefined}>
                  All participants
                </option>
                <option value={MusicalBackground.NaiveListener.toString()}>
                  No musical background
                </option>
                <option value={MusicalBackground.Musician.toString()}>
                  Musicians only
                </option>
                <option value={MusicalBackground.Microtonalist.toString()}>
                  Microtonalists only
                </option>
                <option value={"0"}>
                  Show none
                </option>
              </Select>
            </Field>
          </div>
        </Fieldset>
      </CollapsiblePanel>
      <db.SignedOut>
        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[0].frequency}
          title={EXPERIMENTS[0].title}
          settings={settings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[1].frequency}
          title={EXPERIMENTS[1].title}
          settings={settings}
        />

        <SurveyChartPublic
          meanFrequency={EXPERIMENTS[2].frequency}
          title={EXPERIMENTS[2].title}
          settings={settings}
        />
      </db.SignedOut>

      <db.SignedIn>
        <SurveyChart
          meanFrequency={EXPERIMENTS[0].frequency}
          title={EXPERIMENTS[0].title}
          settings={settings}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[1].frequency}
          title={EXPERIMENTS[1].title}
          settings={settings}
        />

        <SurveyChart
          meanFrequency={EXPERIMENTS[2].frequency}
          title={EXPERIMENTS[2].title}
          settings={settings}
        />
      </db.SignedIn>
    </>
  )
}

