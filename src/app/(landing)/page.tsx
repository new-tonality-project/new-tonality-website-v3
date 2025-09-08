import { Container, ChevronRightIcon } from '@/components'
import Link from 'next/link'
import { LatestUpdate } from './LatestUpdate'

export default async function Home() {
  return (
    <>
      <Container className="py-30">
        <div className="flex flex-col md:flex-row w-full justify-between gap-16">
          <div className="flex max-w-md flex-grow flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              New Tonality
            </h1>
            <p className="py-6 text-base text-zinc-600 dark:text-zinc-400">
              Musical tuning is more than just simple ratios and tempering. Dive
              deep into the world on microtonality inspired by research in
              psychoacoustics and mathematics.
            </p>

            <Link
              href="/"
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              Videos
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>

            <Link
              href="/"
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              Microtonal web apps
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>

            <Link
              href="/"
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              Support
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>
          </div>

          <LatestUpdate />
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2"></div>
      </Container>
    </>
  )
}
