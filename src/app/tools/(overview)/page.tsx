import { SimpleLayout } from '@/components'
import { ToolCard } from '@/components'
import { tools } from '@/lib'

export default function ToolsPage() {
  return (
    <SimpleLayout
      title="Microtonal web apps"
      intro="A collection of browser-based tools that explore microtonality through the lens of modern psycho acoustic research. Investigate the relationship between instrumental timbre, spectral characteristics, and tuning systems."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {tools.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </ul>
    </SimpleLayout>
  )
}
