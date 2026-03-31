# PocketBase Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate from PayloadCMS + Vercel Postgres to PocketBase, removing all Payload dependencies and using PocketBase as the sole data source for services.

**Architecture:** Next.js App Router fetches services directly from PocketBase SDK. All PayloadCMS code, collections, and admin routes are removed. The site becomes a pure services directory with SSR and full SEO.

**Tech Stack:** Next.js 16, PocketBase SDK, TypeScript, Tailwind CSS

---

## Task 1: Install PocketBase SDK and Remove Payload Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Remove Payload dependencies from package.json**

Remove these lines from `dependencies`:
```json
"@payloadcms/admin-bar": "3.80.0",
"@payloadcms/live-preview-react": "3.80.0",
"@payloadcms/next": "3.80.0",
"@payloadcms/plugin-form-builder": "3.80.0",
"@payloadcms/plugin-nested-docs": "3.80.0",
"@payloadcms/plugin-redirects": "3.80.0",
"@payloadcms/plugin-search": "3.80.0",
"@payloadcms/plugin-seo": "3.80.0",
"@payloadcms/richtext-lexical": "3.80.0",
"@payloadcms/ui": "3.80.0",
"@payloadcms/db-vercel-postgres": "3.80.0",
"payload": "3.80.0",
"graphql": "^16.8.2",
```

Add PocketBase SDK:
```json
"pocketbase": "^0.26.0",
```

**Step 2: Run install to update dependencies**

Run: `pnpm install`
Expected: Dependencies updated successfully

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: replace PayloadCMS with PocketBase SDK"
```

---

## Task 2: Create PocketBase Client and Types

**Files:**
- Create: `src/lib/pocketbase.ts`
- Create: `src/types/service.ts`

**Step 1: Create PocketBase client**

Create `src/lib/pocketbase.ts`:
```typescript
import PocketBase from 'pocketbase'

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb-fly-creteinfo.fly.dev'

export const pb = new PocketBase(POCKETBASE_URL)

// Disable auto-cancellation for SSR requests
pb.autoCancellation(false)
```

**Step 2: Create Service type from PocketBase schema**

Create `src/types/service.ts`:
```typescript
export interface Service {
  id: string
  name: string
  category: string[]
  contact: string
  phone: string
  email: string
  website: string
  airbnb: string
  location: string
  description: string
  flag: boolean
  featuredExplore: boolean
  coverImage: string
  detailImages: string[]
  created: string
  updated: string
}

export interface ServiceFilter {
  q?: string
  category?: string
  location?: string
  featuredExplore?: boolean
}

export const categoryLabels: Record<string, string> = {
  restaurants: 'Restaurants',
  taxi: 'Taxi',
  boats: 'Boats',
  excursions: 'Excursions',
  'rent-a-car': 'Rent a Car',
  accommodations: 'Accommodations',
  shops: 'Shops',
  'cretan-groups': 'Cretan Groups',
}

export const locations = [
  { label: 'Heraklion', value: 'heraklion' },
  { label: 'Chania', value: 'chania' },
  { label: 'Rethymno', value: 'rethymno' },
  { label: 'Agios Nikolaos', value: 'agios-nikolaos' },
  { label: 'Elounda', value: 'elounda' },
  { label: 'Agia Pelagia', value: 'agia-pelagia' },
  { label: 'Malia', value: 'malia' },
  { label: 'Hersonissos', value: 'hersonissos' },
]
```

**Step 3: Commit**

```bash
git add src/lib/pocketbase.ts src/types/service.ts
git commit -m "feat: add PocketBase client and Service types"
```

---

## Task 3: Create Services Data Fetching Utilities

**Files:**
- Create: `src/lib/services.ts`
- Delete: `src/utilities/getServices.ts`

**Step 1: Create new services utility with PocketBase**

Create `src/lib/services.ts`:
```typescript
import { unstable_cache } from 'next/cache'
import { pb } from './pocketbase'
import type { Service, ServiceFilter } from '@/types/service'

export async function getServices(filter: ServiceFilter = {}): Promise<Service[]> {
  const filterParts: string[] = []

  // Add search query filter (searches in name and description)
  if (filter.q) {
    filterParts.push(`(name ~ "${filter.q}" || description ~ "${filter.q}")`)
  }

  // Add category filter
  if (filter.category) {
    filterParts.push(`category ~ "${filter.category}"`)
  }

  // Add location filter
  if (filter.location) {
    filterParts.push(`location ~ "${filter.location}"`)
  }

  // Add featured filter
  if (filter.featuredExplore !== undefined) {
    filterParts.push(`featuredExplore = ${filter.featuredExplore}`)
  }

  const filterString = filterParts.length > 0 ? filterParts.join(' && ') : ''

  try {
    const result = await pb.collection('services').getList(1, 100, {
      filter: filterString,
      sort: '-created',
    })

    return result.items as unknown as Service[]
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return []
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const record = await pb.collection('services').getOne(id)
    return record as unknown as Service
  } catch (error) {
    console.error('Failed to fetch service:', error)
    return null
  }
}

export async function getServicesByCategory(category: string): Promise<Service[]> {
  return getServices({ category })
}

export async function getFeaturedServices(): Promise<Service[]> {
  return getServices({ featuredExplore: true })
}

/**
 * Returns a cached version of getServices
 */
export const getCachedServices = (filter: ServiceFilter = {}) =>
  unstable_cache(
    async () => getServices(filter),
    ['services', JSON.stringify(filter)],
    {
      tags: ['services'],
      revalidate: 60, // Revalidate every 60 seconds
    },
  )
```

**Step 2: Delete old getServices utility**

Run: `rm src/utilities/getServices.ts`

**Step 3: Commit**

```bash
git add src/lib/services.ts
git commit -m "feat: add PocketBase services data fetching"
```

---

## Task 4: Create Image URL Helper for PocketBase

**Files:**
- Create: `src/lib/utils.ts`

**Step 1: Create utility functions**

Create `src/lib/utils.ts`:
```typescript
import { pb } from './pocketbase'

/**
 * Get the full URL for a PocketBase file
 */
export function getFileUrl(
  collectionId: string,
  recordId: string,
  filename: string,
  options?: { thumb?: string }
): string {
  let url = `${pb.baseUrl}/api/files/${collectionId}/${recordId}/${filename}`

  if (options?.thumb) {
    url += `?thumb=${options.thumb}`
  }

  return url
}

/**
 * Get cover image URL for a service
 */
export function getServiceCoverUrl(service: { collectionId?: string; id: string; coverImage?: string }): string | null {
  if (!service.coverImage) return null

  const collectionId = service.collectionId || 'pbc_863811952'
  return getFileUrl(collectionId, service.id, service.coverImage)
}

/**
 * Get detail images URLs for a service
 */
export function getServiceDetailUrls(
  service: { collectionId?: string; id: string; detailImages?: string[] }
): string[] {
  if (!service.detailImages || service.detailImages.length === 0) return []

  const collectionId = service.collectionId || 'pbc_863811952'
  return service.detailImages.map((filename) => getFileUrl(collectionId, service.id, filename))
}

/**
 * Slugify a string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}
```

**Step 2: Commit**

```bash
git add src/lib/utils.ts
git commit -m "feat: add PocketBase file URL helpers"
```

---

## Task 5: Update Homepage to Use PocketBase

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

**Step 1: Update imports and Service type**

Replace the imports at the top:
```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { getServices } from '@/lib/services'
import { getServiceCoverUrl } from '@/lib/utils'
import type { Service } from '@/types/service'
import { categoryLabels } from '@/types/service'
```

**Step 2: Update Service interface (remove local definition)**

Remove the local `Service` interface and `categoryLabels` definition (they're now imported).

**Step 3: Update ServiceCard component to use PocketBase image URLs**

Replace the ServiceCard component:
```typescript
function ServiceCard({ service, featured = false }: { service: Service; featured?: boolean }) {
  const imageUrl = getServiceCoverUrl(service) || '/images/placeholder-service.jpg'
  const categoryLabel = categoryLabels[service.category?.[0]] || service.category?.[0] || 'Service'

  return (
    <Link
      href={`/services/${service.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a5276]/10">
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {featured && (
          <div className="absolute top-2 right-2 bg-[#d4a84b] text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-[#1a5276] text-sm md:text-base mb-1 group-hover:text-[#2980b9] transition-colors line-clamp-1">
          {service.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-[#1a5276]/60">
          <span className="font-medium">{categoryLabel}</span>
          {service.location && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {service.location}
              </span>
            </>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-[#1a5276]/50 mt-2 line-clamp-2">
            {service.description}
          </p>
        )}
      </div>
    </Link>
  )
}
```

**Step 4: Update location display in HomePage component**

Find the location display line and update to use direct value instead of transformation:
```typescript
{searchParams.location && `${searchParams.q || searchParams.category ? ' • ' : ''}${searchParams.location}`}
```

**Step 5: Commit**

```bash
git add src/app/\(frontend\)/page.tsx
git commit -m "feat: update homepage to use PocketBase"
```

---

## Task 6: Update Service Detail Page to Use PocketBase

**Files:**
- Modify: `src/app/(frontend)/services/[slug]/page.tsx`
- Rename: `src/app/(frontend)/services/[slug]/` → `src/app/(frontend)/services/[id]/`

**Step 1: Rename the services route folder**

Run: `mv src/app/\(frontend\)/services/\[slug\] src/app/\(frontend\)/services/\[id\]`

**Step 2: Update the page.tsx file**

Replace entire file `src/app/(frontend)/services/[id]/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { ArrowLeft, MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react'
import { getServiceById, getServices } from '@/lib/services'
import { getServiceCoverUrl, getServiceDetailUrls } from '@/lib/utils'
import type { Service } from '@/types/service'
import { categoryLabels } from '@/types/service'

interface ServicePageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const services = await getServices({})
  return services.map((service) => ({
    id: service.id,
  }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    return {
      title: 'Service Not Found - Crete Info',
      description: 'The requested service could not be found.',
    }
  }

  return {
    title: `${service.name} - Crete Info`,
    description: service.description || `Discover ${service.name} in Crete.`,
    openGraph: {
      title: service.name,
      description: service.description || `Discover ${service.name} in Crete.`,
      images: getServiceCoverUrl(service) ? [getServiceCoverUrl(service)!] : [],
    },
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params
  const service = await getServiceById(id)

  if (!service) {
    notFound()
    return null
  }

  const categoryLabel = categoryLabels[service.category?.[0]] || service.category?.[0] || 'Service'
  const detailImageUrls = getServiceDetailUrls(service)

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-[#1a5276]/40">/</span>
          <Link
            href={`/?category=${service.category?.[0]}`}
            className="text-sm text-[#1a5276]/60 hover:text-[#1a5276] transition-colors"
          >
            {categoryLabel}
          </Link>
          <span className="mx-2 text-[#1a5276]/40">/</span>
          <span className="text-sm font-medium text-[#1a5276]">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1a5276] mb-2">
                {service.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a5276] text-white">
                  {categoryLabel}
                </span>
                {service.location && (
                  <span className="flex items-center gap-1 text-xs text-[#1a5276]/60">
                    <MapPin className="w-3 h-3" />
                    {service.location}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <div className="bg-[#f8f9fa] rounded-xl p-6">
                <p className="text-[#1a5276]/80 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold text-[#1a5276]">
                Contact Information
              </h2>

              <div className="space-y-3">
                {service.contact && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#1a5276]/60" />
                    <span className="text-[#1a5276]">{service.contact}</span>
                  </div>
                )}
                {service.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#1a5276]/60" />
                    <a href={`tel:${service.phone}`} className="text-[#1a5276] hover:text-[#2980b9] transition-colors">
                      {service.phone}
                    </a>
                  </div>
                )}
                {service.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#1a5276]/60" />
                    <a href={`mailto:${service.email}`} className="text-[#1a5276] hover:text-[#2980b9] transition-colors">
                      {service.email}
                    </a>
                  </div>
                )}
                {service.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#1a5276]/60" />
                    <a
                      href={service.website.startsWith('http') ? service.website : `https://${service.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {service.airbnb && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#1a5276]/60" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <a
                      href={service.airbnb.startsWith('http') ? service.airbnb : `https://${service.airbnb}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a5276] hover:text-[#2980b9] transition-colors"
                    >
                      View on Airbnb
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-1">
            <h2 className="font-display text-xl font-semibold text-[#1a5276] mb-4">
              Gallery
            </h2>
            {detailImageUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {detailImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[#f8f9fa]"
                  >
                    <Image
                      src={url}
                      alt={`${service.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-[#f8f9fa] flex items-center justify-center">
                <span className="text-[#1a5276]/40 text-sm">No images available</span>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1a5276] hover:text-[#2980b9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
```

**Step 3: Commit**

```bash
git add src/app/\(frontend\)/services/
git commit -m "feat: update service detail page to use PocketBase"
```

---

## Task 7: Update Next.js Config

**Files:**
- Modify: `next.config.ts`

**Step 1: Remove withPayload wrapper and add PocketBase image domain**

Replace entire file:
```typescript
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { redirects } from './redirects'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [100],
    remotePatterns: [
      // PocketBase images
      {
        protocol: 'https',
        hostname: 'pb-fly-creteinfo.fly.dev',
        pathname: '/api/files/**',
      },
      // Self URL for dynamic OG images
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default nextConfig
```

**Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: remove withPayload, add PocketBase image domain"
```

---

## Task 8: Update Layout to Remove AdminBar

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`

**Step 1: Remove AdminBar import and component**

Remove this import:
```typescript
import { AdminBar } from '@/components/AdminBar'
```

Remove the AdminBar component from the JSX:
```typescript
<AdminBar
  adminBarProps={{
    preview: isEnabled,
  }}
/>
```

Remove the draftMode import:
```typescript
import { draftMode } from 'next/headers'
```

Remove the draftMode usage:
```typescript
const { isEnabled } = await draftMode()
```

**Step 2: Update the full layout file**

```typescript
import type { Metadata, Viewport } from 'next'
import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Playfair_Display, DM_Sans } from 'next/font/google'

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
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable, playfair.variable, dmSans.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
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
  description: 'Discover the best restaurants, taxis, boat tours, accommodations, and services in Crete. Your complete guide to exploring this beautiful Greek island.',
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
```

**Step 3: Commit**

```bash
git add src/app/\(frontend\)/layout.tsx
git commit -m "chore: remove AdminBar from layout"
```

---

## Task 9: Delete Payload-Related Files and Folders

**Files:**
- Delete: `src/payload.config.ts`
- Delete: `src/collections/` (entire folder)
- Delete: `src/payload-types.ts`
- Delete: `src/app/(payload)/` (entire folder)
- Delete: `src/blocks/` (entire folder)
- Delete: `src/heros/` (entire folder)
- Delete: `src/fields/` (entire folder)
- Delete: `src/hooks/` (entire folder)
- Delete: `src/plugins/` (entire folder)
- Delete: `src/components/AdminBar/` (entire folder)
- Delete: `src/components/BeforeLogin/` (entire folder)
- Delete: `src/components/BeforeDashboard/` (entire folder)
- Delete: `src/components/LivePreviewListener/` (entire folder)
- Delete: `src/components/CollectionArchive/` (entire folder)
- Delete: `src/components/PayloadRedirects/` (entire folder)
- Delete: `src/components/Media/` (entire folder)
- Delete: `src/components/RichText/` (entire folder)
- Delete: `src/components/Link/` (entire folder)
- Delete: `src/components/Card/` (entire folder)
- Delete: `src/components/PageRange/` (entire folder)
- Delete: `src/components/Pagination/` (entire folder)
- Delete: `src/utilities/formatAuthors.ts`
- Delete: `src/utilities/getDocument.ts`
- Delete: `src/utilities/getMeUser.ts`
- Delete: `src/utilities/getMediaUrl.ts`
- Delete: `src/app/(frontend)/[slug]/` (dynamic page route)
- Delete: `src/app/(frontend)/posts/` (entire folder)
- Delete: `src/app/(frontend)/search/` (entire folder)
- Delete: `src/app/(frontend)/next/` (entire folder - preview/seed routes)
- Delete: `src/app/(frontend)/(sitemaps)/` (entire folder - will recreate)
- Delete: `src/Header/hooks/` (entire folder)
- Delete: `src/Header/RowLabel.tsx`
- Delete: `src/Header/config.ts`
- Delete: `src/Header/Nav/` (entire folder)
- Delete: `src/Footer/config.ts`

**Step 1: Delete Payload config and collections**

Run:
```bash
rm -rf src/payload.config.ts
rm -rf src/collections
rm -rf src/payload-types.ts
rm -rf src/app/\(payload\)
```

**Step 2: Delete blocks, heros, fields, hooks, plugins**

Run:
```bash
rm -rf src/blocks
rm -rf src/heros
rm -rf src/fields
rm -rf src/hooks
rm -rf src/plugins
```

**Step 3: Delete Payload-specific components**

Run:
```bash
rm -rf src/components/AdminBar
rm -rf src/components/BeforeLogin
rm -rf src/components/BeforeDashboard
rm -rf src/components/LivePreviewListener
rm -rf src/components/CollectionArchive
rm -rf src/components/PayloadRedirects
rm -rf src/components/Media
rm -rf src/components/RichText
rm -rf src/components/Link
rm -rf src/components/Card
rm -rf src/components/PageRange
rm -rf src/components/Pagination
```

**Step 4: Delete Payload utilities**

Run:
```bash
rm -f src/utilities/formatAuthors.ts
rm -f src/utilities/getDocument.ts
rm -f src/utilities/getMeUser.ts
rm -f src/utilities/getMediaUrl.ts
```

**Step 5: Delete unused routes**

Run:
```bash
rm -rf src/app/\(frontend\)/\[slug\]
rm -rf src/app/\(frontend\)/posts
rm -rf src/app/\(frontend\)/search
rm -rf src/app/\(frontend\)/next
rm -rf src/app/\(frontend\)/\(sitemaps\)
```

**Step 6: Delete Header/Footer Payload-related files**

Run:
```bash
rm -rf src/Header/hooks
rm -f src/Header/RowLabel.tsx
rm -f src/Header/config.ts
rm -rf src/Header/Nav
rm -f src/Footer/config.ts
```

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: remove all PayloadCMS-related files"
```

---

## Task 10: Create Services Sitemap

**Files:**
- Create: `src/app/sitemap.ts`

**Step 1: Create dynamic sitemap**

Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'
import { getServices } from '@/lib/services'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices({})
  const baseUrl = getServerSideURL()

  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: new Date(service.updated || service.created),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...serviceUrls,
  ]
}
```

**Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add dynamic sitemap for services"
```

---

## Task 11: Update Package.json Scripts

**Files:**
- Modify: `package.json`

**Step 1: Remove Payload-related scripts**

Remove these scripts:
```json
"generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
"generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
"payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
```

**Step 2: Simplify scripts (remove cross-env NODE_OPTIONS)**

Update scripts to be cleaner:
```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap --config next-sitemap.config.cjs",
    "dev": "next dev",
    "dev:prod": "rm -rf .next && pnpm build && pnpm start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "start": "next start",
    "test": "pnpm run test:int && pnpm run test:e2e",
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:int": "vitest run --config ./vitest.config.mts"
  }
}
```

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: remove Payload scripts from package.json"
```

---

## Task 12: Add Environment Variables

**Files:**
- Modify: `.env.example` (or create if doesn't exist)

**Step 1: Create/update .env.example**

```
# PocketBase
NEXT_PUBLIC_POCKETBASE_URL=https://pb-fly-creteinfo.fly.dev

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
VERCEL_PROJECT_PRODUCTION_URL=your-project-url.vercel.app
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: update env example for PocketBase"
```

---

## Task 13: Verify Build and Test

**Step 1: Run lint**

Run: `pnpm lint`
Expected: No errors (may have warnings)

**Step 2: Run build**

Run: `pnpm build`
Expected: Build succeeds

**Step 3: Test locally**

Run: `pnpm dev`
Expected: Dev server starts on localhost:3000

**Step 4: Verify pages load**

- Visit http://localhost:3000 - should show homepage with services
- Click a service - should show detail page
- Test filters - should filter services

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve build issues after PocketBase migration"
```

---

## Summary

This plan migrates the site from PayloadCMS to PocketBase by:
1. Replacing Payload dependencies with PocketBase SDK
2. Creating new data fetching utilities for PocketBase
3. Updating pages to use PocketBase data
4. Removing all Payload-related code and files
5. Maintaining full SSR and SEO support

The site becomes a simpler, faster services directory powered by PocketBase.
