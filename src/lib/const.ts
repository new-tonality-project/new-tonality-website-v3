import { type BasicLink } from './types'

export const EBOOK_LINKS = {
  payhip: 'https://payhip.com/b/TtdJB',
  arxiv: 'https://arxiv.org/abs/2506.13969',
}

export const NAV_ITEMS: BasicLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'eBook', href: EBOOK_LINKS.payhip },
]

export const SOCIAL_MEDIA_LINKS = {
  github: 'https://github.com/new-tonality-project',
  youtube: 'https://www.youtube.com/@new_tonality',
}
