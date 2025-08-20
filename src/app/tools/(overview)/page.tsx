import { Card, Container, LinkIcon, SimpleLayout } from '@/components'
import Image from 'next/image'
import setharesDissonanceImage from '@/images/tools/sethares-dissonance.png'

const projects = [
  {
    name: 'Sethares Dissonance',
    logo: setharesDissonanceImage,
    link: { href: '/tools/sethares-dissonance', label: 'Explore' },
    description: 'Explore the world of dissonance curves',
  },
]

export default function ToolsPage() {
  return (
    <SimpleLayout title="Tools overview" intro="Explore the word of inharmonicity and dynamic tuning systems.">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name} >
            <div className="relative z-20 aspect-video w-full bg-white">
              <Image
                src={project.logo}
                alt=""
                fill
                className="rounded-lg"
                objectFit="cover"
              />
            </div>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href}>{project.name}</Card.Link>
            </h2>
            <Card.Description>{project.description}</Card.Description>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
