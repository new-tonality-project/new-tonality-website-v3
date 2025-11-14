import { Container } from '@/components/Container'

export function SimpleLayout({
  title,
  intro,
  children,
}: {
  title: string
  intro?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Container className="mt-16 sm:mt-32">
      <header>
        <h1 className="max-w-2xl text-4xl font-light tracking-wide text-zinc-800 sm:text-5xl dark:text-zinc-100">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">{intro}</p>}
      </header>
      {children && <div className="mt-16 sm:mt-20">{children}</div>}
    </Container>
  )
}
