import { Button, Prose, Spinner } from '@/components'
import { useSurveyMachine } from '@/state/machines'
import { db } from '@/db'
import { useEffect, useRef, useState } from 'react'
import { submitSurvey } from '../actions'
import { TextLink } from '@/components/catalyst/text'

export function SurveyError() {
  const [state] = useSurveyMachine()
  const [error, setError] = useState<Object | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const data = {
    scores: state.context.intervals?.scores ?? [],
    shareDataPrivately: state.context.shareDataPrivately,
    shareDataPublicly: state.context.shareDataPublicly,
    musicalBackground: state.context.musicalBackground,
    meanFrequency: state.context.meanFrequency,
    userId: db.useUser().id,
  }

  useEffect(() => {
    async function getError() {
      setLoading(true)
      try {
        await submitSurvey(data)
      } catch (err) {
        const error = err as Error & { code?: string }
        setError({
          message: error?.message || null,
          stack: error?.stack || null,
          name: error?.name || null,
          code: error?.code || null,
        })
      } finally {
        setLoading(false)
      }
    }

    if (!loading) getError()

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  function copyToClipboard() {
    try {
      navigator.clipboard.writeText(
        JSON.stringify({ ...error, ...data }, null, 2),
      )
      setCopied(true)
      timeout.current = setTimeout(() => {
        setCopied(false)
        timeout.current = null
      }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Prose>
      <p className="mb-0">
        Sorry, but there was an error submitting your results. You can help us
        to resolve this issue if you send the data below to the{' '}
        <TextLink href="mailto:support@newtonality.net">
          support@newtonality.net
        </TextLink>{' '}
        so we can investigate the issue.
      </p>
      {loading ? (
        <div className="flex items-center justify-center">
          <Spinner />
          <p>Collecting data...</p>
        </div>
      ) : (
        <>
          <Button className="min-w-44 mb-0" onClick={copyToClipboard}>
            {copied ? 'Copied!' : 'Copy data to clipboard'}
          </Button>
          <div className="max-h-[300px] overflow-y-auto">
            <pre className="mt-0 whitespace-pre-wrap">
              {JSON.stringify({ ...error, ...data }, null, 2)}
            </pre>
          </div>
        </>
      )}
    </Prose>
  )
}
