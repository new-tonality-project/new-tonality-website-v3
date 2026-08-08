'use client'

import { Container, Prose } from '@/components'
import { db } from '@/db'
import { BeatingAnalysisTool } from './components/BeatingAnalysisTool'

export default function BeatingAnalysisPage() {
  return (
    <>
      <div className="hidden lg:block">
        <db.SignedIn>
          <BeatingAnalysisTool />
        </db.SignedIn>
      </div>

      <Container className="mt-16 lg:mt-32 lg:hidden">
        <Container>
          <header>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              Beating analysis
            </h1>
          </header>
          <Prose>
            <p>
              This tool requires a larger screen to use. Please open it on a
              desktop or tablet in landscape orientation.
            </p>
          </Prose>
        </Container>
      </Container>
    </>
  )
}
