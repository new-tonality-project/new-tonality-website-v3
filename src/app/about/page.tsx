import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { GitHubIcon, YouTubeIcon, MailIcon } from '@/components/Icons'
import { SOCIAL_MEDIA_LINKS } from '@/lib'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-sky-500 dark:text-zinc-200 dark:hover:text-sky-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-sky-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'New Tonality explores microtonality through research, tools, and education.',
}

export default function AboutPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="max-w-3xl px-6 lg:px-0 mx-auto grid grid-cols-1 gap-y-16 lg:grid-cols-[1fr_auto] lg:grid-rows-[1fr_auto] lg:gap-y-12">
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            About New Tonality
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              New Tonality is a project dedicated to exploring microtonality
              through the lens of modern psychoacoustic research. We investigate
              the relationship between instrumental timbre, spectral
              characteristics, and tuning systems.
            </p>

            <p>
              Our mission is to make microtonality accessible and
              understandable, providing browser-based tools for experimentation
              and learning. We offer interactive surveys, synthesizers, and
              educational resources to help musicians, researchers, and
              enthusiasts explore the fascinating world of alternative tuning
              systems.
            </p>

            <p>
              Through our tools and research, we aim to bridge the gap between
              theoretical understanding and practical application, making it
              easier for anyone to experiment with and understand how different
              tuning systems interact with timbre and spectral content.
            </p>
          </div>
        </div>
        <div className="max-w-sm lg:pt-20 lg:pl-20">
          <ul role="list">
            <SocialLink href={SOCIAL_MEDIA_LINKS.youtube} icon={YouTubeIcon}>
              Follow on YouTube
            </SocialLink>
            <SocialLink
              href={SOCIAL_MEDIA_LINKS.github}
              icon={GitHubIcon}
              className="mt-4"
            >
              Follow on GitHub
            </SocialLink>

            <li className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40">
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                Found a bug, experiencing issues, <br /> or have a general
                question? <br /> Contact us:
              </p>
              <Link
                href="mailto:info@newtonality.com"
                className="group flex text-sm font-medium text-zinc-800 transition hover:text-sky-500 dark:text-zinc-200 dark:hover:text-sky-500"
              >
                <MailIcon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-sky-500" />
                <span className="ml-4">info@newtonality.com</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
