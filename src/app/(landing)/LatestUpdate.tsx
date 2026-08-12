import { ChevronRightIcon } from '@/components'
import { BOOK_LINKS } from '@/lib'
import Link from 'next/link'

export function LatestUpdate() {
  return (
    <article className="mx-auto max-w-full md:mx-0 md:max-w-xs">
      <h2 className="mr-6 w-fit rounded-t-lg bg-amber-400 px-8 py-1 font-bold text-white">
        Latest update
      </h2>
      <div className="rounded-tr-lg rounded-b-lg border-2 border-amber-400 px-7 py-8">
        <h3 className="pb-4 text-xl">
          Set theoretic solution <br /> for the tuning problem
        </h3>
        <p className="pb-2 font-thin">
          There are many theories that attempt to explain consonance and
          dissonance in music. In this book, I explore the boundaries of
          today’s most compelling theories and introduce a new approach rooted
          in mathematical set theory.
        </p>
        <Link
          href={BOOK_LINKS.hardcover}
          className="mt-1 flex items-center gap-1 text-amber-600"
        >
          Buy Hardcover
          <ChevronRightIcon className="h-4 w-4 stroke-current" />
        </Link>
        <Link
          href={BOOK_LINKS.eBook}
          className="mt-1 flex items-center gap-1 text-amber-600"
        >
          Buy eBook (PDF)
          <ChevronRightIcon className="h-4 w-4 stroke-current" />
        </Link>

        <Link
          href={BOOK_LINKS.arxiv}
          className="mt-1 flex items-center gap-1 text-amber-600"
        >
          Free download
          <ChevronRightIcon className="h-4 w-4 stroke-current" />
        </Link>
      </div>
    </article>
  )
}
