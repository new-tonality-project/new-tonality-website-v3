import { Card, LinkIcon } from '@/components'
import { type Tool } from '@/lib'
import Image from 'next/image'

export function ToolCard(props: Tool) {
  return (
    <Card as="li">
      <div className="relative z-20 aspect-video w-full overflow-hidden rounded-lg border border-zinc-200">
        <Image src={props.logo} alt="" fill objectFit="cover" />
      </div>
      <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={props.link.href}>{props.name}</Card.Link>
      </h2>
      <Card.Description>{props.description}</Card.Description>
      <p className="relative z-10 mt-auto flex pt-4 text-sm font-medium text-zinc-400 transition group-hover:text-sky-500 dark:text-zinc-200">
        <LinkIcon className="h-6 w-6 flex-none" />
        <span className="ml-2">{props.link.label}</span>
      </p>
    </Card>
  )
}
