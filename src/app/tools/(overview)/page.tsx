import { SimpleLayout } from '@/components'
import setharesDissonanceImage from '@/images/tools/sethares-dissonance.png'
import { ToolCard } from './ToolCard'
import { type Tool } from '@/lib'

const tools: Tool[] = [
  {
    name: 'Dissonance survey',
    logo: setharesDissonanceImage,
    link: { href: '/tools/dissonance-survey', label: 'Explore' },
    description: 'Take part in survey of how people percieve dissonance',
  },
]

export default function ToolsPage() {
  return (
    <SimpleLayout
      title="Tools overview"
      intro="Explore the word of inharmonicity and dynamic tuning systems."
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
