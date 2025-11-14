import { Container, ChevronRightIcon, ToolsSection } from '@/components'
import Link from 'next/link'
import { LatestUpdate } from './LatestUpdate'
import Image from 'next/image'
import frontCover from '@/images/front-cover.jpg'

export default async function Home() {
  return (
    <>
      <Container className="pt-30">
        <div className="flex w-full flex-col justify-between gap-16 md:flex-row">
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
      <ToolsSection
        className="my-24 md:my-28"
        title="Microtonal web apps"
        description="Educate yourself on different concepts in psychoacoustics and microtonality by playing with a set of tools that run on your browser. Consider creating an account for the best experience."
        tools={[
          {
            title: 'Dissonance perception survey',
            description:
              'Go thorugh the actual psychoacoustic experiment that was first outlined in 1960s paper by Plomp and Levelt and that is the basis behind modern empirical understanding of dissoannce.',
            href: '/tools/dissonance-survey',
            linkText: 'Explore',
          },
        ]}
      />

      <Container className="my-24 md:my-28">
        <div className="mx-auto flex max-w-4xl flex-grow gap-20">
          <div className="relative aspect-10/16 basis-1/2 py-8">
            <Image src={frontCover} fill alt="" objectFit="cover" />
          </div>

          <div className="flex basis-1/2 flex-col justify-center">
            <p className="font-thin">eBook</p>
            <h2 className="text-xl font-bold">
              Set theoretic solution <br /> for the tuning problem
            </h2>
            <p className="py-8">
              My goal is to make microtonality easy and accessible and to
              popularize that topic. During my research I found that various
              tuning systems have pros and cons. In the attempt to simplify the
              theory of William Sethares I stumbled upon the idea of using set
              theory to derive tuning. After 2 years of R&D I wrote this eBook
              to lay out haw that can be done and compre it with other tuning
              systems.
            </p>
            <Link
              href="/"
              className="mt-2 flex items-center gap-1 text-sky-600"
            >
              Buy on Payhip
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>

            <Link
              href="/"
              className="mt-1 flex items-center gap-1 text-sky-600"
            >
              Download on Arxiv
              <ChevronRightIcon className="h-4 w-4 stroke-current" />
            </Link>
          </div>
        </div>
      </Container>
    </>
  )
}
