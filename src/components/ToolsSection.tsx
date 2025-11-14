import Link from 'next/link'
import { Container, ChevronRightIcon, Prose } from '@/components'
import { Text } from './catalyst/text'

export interface Tool {
  title: string
  description: string
  href: string
  linkText?: string
  linkClassName?: string
}

export interface ToolsSectionProps {
  title: string
  description: string
  tools: Tool[]
  className?: string
}

export function ToolsSection({
  title,
  description,
  tools,
  className,
}: ToolsSectionProps) {
  return (
    <Container className={className}>
      <div className="mx-auto max-w-xl lg:max-w-none">
        <Prose className='pb-8'>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="max-w-2xl">{description}</p>
        </Prose>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-3 lg:items-stretch">
          {tools.map((tool, index) => (
              <article key={index} className="flex w-full flex-col rounded-lg border-1 border-zinc-100 px-6 py-8 shadow-lg shadow-zinc-800/5">
                <Prose>
                  <h3 className="pb-4 m-0">{tool.title}</h3>
                  <p className="flex-grow font-thin">{tool.description}</p>
                </Prose>
                  <Link
                    href={tool.href}
                    className={
                      tool.linkClassName ||
                      'mt-auto flex items-center gap-1 text-amber-600'
                    }
                  >
                    {tool.linkText || 'Explore'}
                    <ChevronRightIcon className="h-4 w-4 stroke-current" />
                  </Link>
              </article>
          ))}
        </div>
      </div>
    </Container>
  )
}
