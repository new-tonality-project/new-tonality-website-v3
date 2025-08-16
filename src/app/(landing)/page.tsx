import { Container, SocialLink, GitHubIcon, YouTubeIcon } from '@/components'
import { SOCIAL_MEDIA_LINKS } from '@/lib'

export default async function Home() {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Welcome to the New Tonality
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            We aim to explore and popularize novel approaches to musical tuning.
          </p>
          <div className="mt-6 flex gap-6">
            <SocialLink
              href={SOCIAL_MEDIA_LINKS.github}
              aria-label="Follow on GitHub"
              icon={GitHubIcon}
            />
            <SocialLink
              href={SOCIAL_MEDIA_LINKS.youtube}
              aria-label="Follow on GitHub"
              icon={YouTubeIcon}
            />
          </div>
        </div>
      </Container>
      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2"></div>
      </Container>
    </>
  )
}
