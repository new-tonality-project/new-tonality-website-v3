import { type BasicLink } from './types'

export const BOOK_LINKS = {
  hardcover: 'https://www.lulu.com/shop/vsevolod-deriushkin/set-theoretic-solution-for-the-tuning-problem-hardcover/hardcover/product-rm462vk.html?page=1&pageSize=4',
  eBook: 'https://www.lulu.com/shop/vsevolod-deriushkin/set-theoretic-solution-for-the-tuning-problem-ebook/ebook/product-m2ee2mr.html?page=1&pageSize=4',
  arxiv: 'https://arxiv.org/abs/2506.13969',
}

export const NAV_ITEMS: BasicLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Tools', href: '/tools' },
  { label: 'About', href: '/about' },
]

export const SOCIAL_MEDIA_LINKS = {
  github: 'https://github.com/new-tonality-project',
  youtube: 'https://www.youtube.com/@new_tonality',
}
