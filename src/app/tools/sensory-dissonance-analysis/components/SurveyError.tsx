import { Prose, Spinner } from '@/components'
import { useSurveyMachine } from '@/state/machines'
import { db } from '@/db'
import { useEffect, useState } from 'react'
import { submitSurvey } from '../actions'

export function SurveyError() {
  const [state] = useSurveyMachine()
  const [error, setError] = useState<unknown | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const data = {
    scores: state.context.intervals!.scores,
    shareDataPrivately: state.context.shareDataPrivately,
    shareDataPublicly: state.context.shareDataPublicly,
    musicalBackground: state.context.musicalBackground,
    meanFrequency: state.context.meanFrequency,
    userId: db.useUser().id,
  }

  useEffect(() => {
    setLoading(true)
    try {
      submitSurvey(data)
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }, [data])

  return (
    <Prose>
      <p>
        There was an error submitting your results. Copy the data below and send
        it to the support@newtonality.net so we can investigate the issue.
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
          <p>Collecting data...</p>
        </div>
      ) : (
        <>
          <p>Data:</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <p>Error:</p>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </>
      )}
    </Prose>
  )
}
