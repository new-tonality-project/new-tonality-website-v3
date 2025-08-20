import { type Metadata } from 'next'
import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { ClerkProvider } from '@clerk/nextjs'

import '@/styles/tailwind.css'
import InstantDBAuthSync from '@/components/InstantDBAuthSync'

export const metadata: Metadata = {
  title: {
    template: '%s - New Tonality',
    default:
      'New Tonality - A place to learn about novel approaches to musical tuning',
  },
  description:
    'New Tonality is the project to explore and popularize novel approaches to musical tuning.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <InstantDBAuthSync />
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
