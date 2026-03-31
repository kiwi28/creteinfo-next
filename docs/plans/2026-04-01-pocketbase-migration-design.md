# PocketBase Migration Design

## Overview

Migrate from PayloadCMS + Vercel Postgres to PocketBase for the services directory. Remove all Payload-related code and dependencies.

## Current State

- Next.js 16.2.1 with App Router
- PayloadCMS 3.80.0 with Vercel Postgres adapter
- Multiple collections (Pages, Posts, Services, Categories, Media, Users, Forms)
- Complex CMS setup with admin panel

## Target State

- Next.js 16.2.1 with App Router (unchanged)
- PocketBase (hosted at `https://pb-fly-creteinfo.fly.dev`)
- Single collection: Services
- PocketBase admin UI for content management
- Full SSR and SEO support

## Architecture

```
Next.js App Router
       |
       v
PocketBase SDK (pocketbase-js)
       |
       v
https://pb-fly-creteinfo.fly.dev
       |
       v
Services Collection
```

## Data Model

From PocketBase schema:

```typescript
interface Service {
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
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with all services + category filter |
| `/services/[id]` | Service detail page |

## SEO Implementation

- **generateMetadata**: Dynamic meta tags from service data
- **Sitemap**: Generated from PocketBase services
- **Open Graph**: Service name, description, coverImage
- **Structured Data**: LocalBusiness JSON-LD schema

## Caching Strategy

- Next.js `unstable_cache` with tags for service lists
- Time-based revalidation (configurable)
- No additional caching layer needed

## Image Handling

- Images served from PocketBase: `https://pb-fly-creteinfo.fly.dev/api/files/{collectionId}/{id}/{filename}`
- Next.js Image component with remote pattern for PocketBase domain

## Environment Variables

```env
NEXT_PUBLIC_POCKETBASE_URL=https://pb-fly-creteinfo.fly.dev
```

## Files to Delete

- `src/payload.config.ts`
- `src/collections/*` (entire folder)
- `src/payload-types.ts`
- Payload-related utilities and seed files

## Files to Create

- `src/lib/pocketbase.ts` - PocketBase client
- `src/lib/services.ts` - Data fetching utilities
- `src/types/service.ts` - TypeScript types

## Files to Modify

- `package.json` - Remove Payload dependencies, add pocketbase
- `src/app/(frontend)/page.tsx` - Homepage with services
- `src/app/(frontend)/services/[id]/page.tsx` - Detail page
- `next.config.ts` - Add PocketBase image domain
- `src/app/(frontend)/layout.tsx` - Update metadata
- Sitemap configuration

## Dependencies to Remove

- `@payloadcms/*` packages
- `payload`
- `@vercel/postgres`
- Payload plugins

## Dependencies to Add

- `pocketbase` - PocketBase JavaScript SDK
