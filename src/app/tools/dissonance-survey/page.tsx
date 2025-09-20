import { SimpleLayout } from '@/components'
import { SurveyChart } from './SurveyChart'
import { SurveyIntervals } from '@/classes'

export default async function DissonanceSurveyPage() {
  const intervals = new SurveyIntervals()

  return (
    <SimpleLayout title="Dissonance survey" intro="Description here">
      <SurveyChart data={intervals.plotData} />
    </SimpleLayout>
  )
}
