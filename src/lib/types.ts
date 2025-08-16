export type BasicLink = { label: string; href: string }

export type Article = {
  title: string
  description: string
  author: string
  date: string
}

export type ArticleWithSlug = Article & {
  slug: string
}
