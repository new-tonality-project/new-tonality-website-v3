import { SimpleLayout } from '@/components'
import { SurveyChart } from './SurveyChart'
import { SurveyIntervals } from '@/classes'
import { Survey } from './Survey'

export default async function DissonanceSurveyPage() {
  return (
    <SimpleLayout title="Dissonance survey" intro="Description here">
      <Survey medianFrequency={440} />
    </SimpleLayout>
  )
}
