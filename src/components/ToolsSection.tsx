import { Container, Prose } from '@/components'
import { type Tool } from '@/lib'
import { ToolCard } from './ToolCard'

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
      <div className="mx-auto max-w-xl lg:max-w-none px-6">
        <Prose className='pb-8'>
          <h2 className="text-4xl pb-6 font-normal tracking-wide">{title}</h2>
          <p className="max-w-2xl">{description}</p>
        </Prose>

        <ul
          role="list"
          className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-3 lg:items-stretch"
        >
          {tools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </ul>
      </div>
    </Container>
  )
}
