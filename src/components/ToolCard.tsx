import { Card, LinkIcon } from '@/components'
import { type Tool } from '@/lib'
import Image from 'next/image'

export function ToolCard(props: Tool) {
  return (
    <Card as="li">
      <div className="relative z-20 aspect-video w-full bg-white">
        <Image
          src={props.logo}
          alt=""
          fill
          className="rounded-lg"
          objectFit="cover"
        />
      </div>
      <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
        <Card.Link href={props.link.href}>{props.name}</Card.Link>
      </h2>
      <Card.Description>{props.description}</Card.Description>
      <p className="relative z-10 pt-4 flex text-sm font-medium text-zinc-400 transition group-hover:text-sky-500 dark:text-zinc-200">
        <LinkIcon className="h-6 w-6 flex-none" />
        <span className="ml-2">{props.link.label}</span>
      </p>
    </Card>
  )
}
