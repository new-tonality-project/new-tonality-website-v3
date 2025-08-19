import { type Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import {
  ClerkProvider,
} from '@clerk/nextjs'

import '@/styles/tailwind.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s - New Tonality',
    default:
      'New Tonality - A place to learn about novel approaches to musical tuning',
  },
  description:
    'New Tonality is the project to explore and popularize novel approaches to musical tuning.',
  // alternates: {
  //   types: {
  //     'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
  //   },
  // },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased" suppressHydrationWarning>
        <body className="flex h-full bg-zinc-50 dark:bg-black">
          <Providers>
            <div className="flex w-full">
              <Layout>{children}</Layout>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
