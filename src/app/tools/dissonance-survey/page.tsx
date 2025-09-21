import { SimpleLayout } from '@/components'
import { SurveyChart } from './SurveyChart'
import { SurveyIntervals } from '@/classes'
import { PlayIntervals } from './PlayIntervals'

export default async function DissonanceSurveyPage() {
  const intervals = new SurveyIntervals()

  return (
    <SimpleLayout title="Dissonance survey" intro="Description here">
      <SurveyChart data={intervals.plotData} />
      <PlayIntervals intervalFrequencies={intervals.getFrequencies(440)} />
    </SimpleLayout>
  )
}
