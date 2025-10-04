import { type StaticImageData } from "next/image";

export type BasicLink = { label: string; href: string }

export type Article = {
  title: string
  description: string
  author: string
  date: string
}

export type Tool = {
  name: string
  description: string
  logo: StaticImageData
  link: BasicLink
}

export type ArticleWithSlug = Article & {
  slug: string
}

export type PlotPoint = {
  x: number
  y: number
}
