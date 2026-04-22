import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import { ServiceCategoriesProvider } from '@/providers/ServiceCategories'
import { getServiceCategories } from '@/lib/services'
import type { ServiceType } from '@/types/service'

import { Playfair_Display, DM_Sans } from 'next/font/google'

import './(frontend)/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch service categories server-side for all routes
  const serviceCategories = await getServiceCategories()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, playfair.variable, dmSans.variable)}
      lang="en"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
      </head>
      <body>
        <ServiceCategoriesProvider initialCategories={serviceCategories}>
          {children}
        </ServiceCategoriesProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: 'Crete Info - Your Gateway to the Island of Crete',
    template: '%s | Crete Info',
  },
  description:
    'Discover the best restaurants, taxis, boat tours, accommodations, and services in Crete. Your complete guide to exploring this beautiful Greek island.',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@creteinfo',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}
