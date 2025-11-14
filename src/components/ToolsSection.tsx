import Link from 'next/link'
import { Container, ChevronRightIcon } from '@/components'

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
      <div className="mx-auto grid max-w-xl grid-cols-1 gap-x-10 gap-y-20 lg:max-w-none lg:grid-cols-3">
        <div className="py-8">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="py-8">{description}</p>
        </div>

        {tools.map((tool, index) => (
          <div key={index}>
            <article className="rounded-lg border-1 border-zinc-100 px-6 py-8 shadow-lg shadow-zinc-800/5 md:mx-0 md:max-w-xs">
              <h3 className="pb-4 text-xl">{tool.title}</h3>
              <p className="pb-2 font-thin">{tool.description}</p>
              <Link
                href={tool.href}
                className={tool.linkClassName || 'mt-2 flex items-center gap-1 text-amber-600'}
              >
                {tool.linkText || 'Explore'}
                <ChevronRightIcon className="h-4 w-4 stroke-current" />
              </Link>
            </article>
          </div>
        ))}
      </div>
    </Container>
  )
}

