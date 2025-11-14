import { Container, ChevronRightIcon, ToolsSection, Prose } from '@/components'
import Link from 'next/link'
import { LatestUpdate } from './LatestUpdate'
import Image from 'next/image'
import frontCover from '@/images/front-cover.jpg'
import { EBOOK_LINKS, SOCIAL_MEDIA_LINKS, tools } from '@/lib'

export default async function Home() {
  return (
    <>
      <Container className="pt-30">
        <div className="flex w-full flex-col justify-between gap-16 md:flex-row">
          <div className="flex max-w-md flex-grow flex-col justify-center px-7">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              New Tonality
            </h1>
            <p className="py-6 text-base text-zinc-600 dark:text-zinc-400">
              Musical tuning is more than just simple ratios and tempering. Dive
              deep into the world on microtonality inspired by research in
              psychoacoustics and mathematics.
            </p>

            <Link
              href={SOCIAL_MEDIA_LINKS.youtube}
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              YouTube Videos
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>

            <Link
              href="/tools"
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              Microtonal web apps
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>
          </div>

          <LatestUpdate />
        </div>
      </Container>
      <ToolsSection
        className="my-24 md:my-28"
        title="Microtonal web apps"
        description="A collection of browser-based tools that explore microtonality through the lens of modern psycho acoustic research. Investigate the relationship between instrumental timbre, spectral characteristics, and tuning systems."
        tools={tools}
      />

      <Container className="my-24 md:my-28">
        <div className="mx-auto flex max-w-4xl flex-grow flex-col px-9 md:flex-row md:gap-20">
          <div className="relative hidden aspect-10/16 py-8 md:order-1 md:block md:w-full md:basis-1/2">
            <Image src={frontCover} fill alt="" objectFit="cover" />
          </div>

          <Prose className="flex w-full flex-col justify-center md:order-2 md:basis-1/2">
            <p className="m-0 font-thin">eBook</p>
            <h2 className="mt-0 text-xl font-bold">
              Set theoretic solution <br /> for the tuning problem
            </h2>
            <p className="mb-0">
              My goal is to make microtonality easy and accessible and to
              popularize that topic. During my research I found that various
              tuning systems have pros and cons. In the attempt to simplify the
              theory of William Sethares I stumbled upon the idea of using set
              theory to derive tuning. After 2 years of R&D I wrote this eBook
              to lay out haw that can be done and compre it with other tuning
              systems.
            </p>

            <div className="flex flex-col gap-1">
              <Link
                href={EBOOK_LINKS.payhip}
                className="flex items-center gap-1 text-sky-600"
              >
                Support on Payhip
                <ChevronRightIcon className="h-4 w-4 stroke-current" />
              </Link>

              <Link
                href={EBOOK_LINKS.arxiv}
                className="flex items-center gap-1 text-sky-600"
              >
                Download on Arxiv
                <ChevronRightIcon className="h-4 w-4 stroke-current" />
              </Link>
            </div>
          </Prose>

          <div className="relative aspect-10/16 w-full md:hidden">
            <Image src={frontCover} fill alt="" objectFit="cover" />
          </div>
        </div>
      </Container>
    </>
  )
}
